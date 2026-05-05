import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Phone, Loader } from 'lucide-react';

export default function FiveStarCalculator() {
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [jobValue, setJobValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const analyzeBusinesses = async () => {
    if (!businessName || !city || !jobValue) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `You are a local business analyst. Search for and analyze Google review data for this plumbing business:

Business: ${businessName}
Location: ${city}

Find:
1. Their approximate Google review count
2. Their most recent review date (estimate days ago)
3. Their average star rating
4. Names of 2-3 top competitor plumbers in the same city
5. Competitor review counts and most recent review dates

Then calculate:
- How many reviews behind they are (difference from top competitor)
- Their review recency gap (days since last review vs. best practice of 14 days)
- Estimated lost calls per month (assume 1 call per 10 review age days + 1 call per 5 reviews behind)

Format your response as a JSON object:
{
  "business": {
    "name": "business name",
    "reviews": 24,
    "rating": 4.8,
    "mostRecentDays": 45
  },
  "competitors": [
    {
      "name": "competitor name",
      "reviews": 38,
      "mostRecentDays": 3
    }
  ],
  "analysis": {
    "reviewGap": 14,
    "recencyGap": 31,
    "estimatedLostCalls": 6
  }
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: prompt }
          ],
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const responseText = data.content[0].text;

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse response');
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      setResults({
        ...analysisData,
        jobValue: parseFloat(jobValue),
        monthlyLoss: analysisData.analysis.estimatedLostCalls * parseFloat(jobValue)
      });
    } catch (err) {
      setError('Unable to analyze. Try again or call us directly.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    setSubmitted(true);
    // Here you'd typically send this data to your backend
    console.log('Phone:', phoneNumber);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-black mb-3">Got it!</h2>
          <p className="text-gray-700 mb-6">
            We'll call {phoneNumber} within the next 24 hours to show you exactly how to close this gap.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setResults(null);
              setBusinessName('');
              setCity('');
              setJobValue('');
              setPhoneNumber('');
            }}
            className="text-black hover:text-gray-700 font-semibold"
          >
            Analyze another business
          </button>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-black p-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {results.business.name}
            </h1>
            <p className="text-gray-600 mb-6">{city}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-black rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{results.business.reviews}</div>
                <div className="text-sm text-gray-300">Google Reviews</div>
              </div>
              <div className="bg-black rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{results.business.rating}</div>
                <div className="text-sm text-gray-300">Star Rating</div>
              </div>
              <div className="bg-black rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{results.business.mostRecentDays}</div>
                <div className="text-sm text-gray-300">Days Old</div>
              </div>
            </div>

            {/* The Problem */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">The Problem</h3>
                  <p className="text-red-800 text-sm">
                    74% of new customers only trust reviews from the last 3 months. Your most recent review is {results.business.mostRecentDays} days old. ChatGPT is recommending plumbers with fresher feedback instead of you.
                  </p>
                </div>
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="mb-8">
              <h3 className="font-bold text-black mb-4">Your Reviews vs. Competitors</h3>
              <div className="space-y-4">
                {/* Your Business */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-black">{results.business.name}</span>
                    <span className="text-sm text-gray-700">{results.business.reviews} reviews ({results.business.mostRecentDays} days)</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <div 
                      className="bg-black h-3 rounded-full" 
                      style={{ width: `${Math.max(30, (results.business.reviews / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Competitors */}
                {results.competitors.map((competitor, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-black">{competitor.name}</span>
                      <span className="text-sm text-gray-700">{competitor.reviews} reviews ({competitor.mostRecentDays} days)</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div 
                        className="bg-gray-600 h-3 rounded-full" 
                        style={{ width: `${(competitor.reviews / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Impact */}
            <div className="bg-black rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white mb-3">What This Costs You</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Estimated lost calls/month:</span>
                      <span className="font-bold text-lg text-white">{results.analysis.estimatedLostCalls}-{Math.round(results.analysis.estimatedLostCalls * 1.5)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Your average job value:</span>
                      <span className="font-bold text-lg text-white">${results.jobValue.toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-gray-700 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-200">Monthly revenue loss:</span>
                      <span className="font-bold text-2xl text-white">${Math.round(results.monthlyLoss).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <p className="text-green-800 text-sm">
                <span className="font-semibold">Here's the good news:</span> 5 Star Collector customers typically close this gap in 60 days and pick up {results.analysis.estimatedLostCalls}-{Math.round(results.analysis.estimatedLostCalls * 1.5)} new calls per month.
              </p>
            </div>
          </div>

          {/* Phone Number CTA */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-black mb-4">Let's Close This Gap</h2>
            <p className="text-gray-700 mb-6">
              Enter your phone number and we'll call you within 24 hours to show you exactly how we do it.
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-500"
                />
              </div>
              <button
                onClick={handlePhoneSubmit}
                className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Phone size={20} />
                Call Me
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            5 Star Collector
          </h1>
          <p className="text-gray-700 mb-8">
            See how much revenue you're leaving on the table due to outdated reviews.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Business Name
              </label>
              <input
                type="text"
                placeholder="e.g., ABC Plumbing"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="e.g., Fremont, CA"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Average Job Value
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="e.g., 650"
                  value={jobValue}
                  onChange={(e) => setJobValue(e.target.value)}
                  className="w-full px-4 py-3 pl-8 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={analyzeBusinesses}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze My Business'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Takes about 15 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
