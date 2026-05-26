import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Phone, Loader, ChevronDown, Share2 } from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'plumbing', label: 'Plumbing', emoji: '🔧', avgJob: 650 },
  { value: 'roofing', label: 'Roofing', emoji: '🏠', avgJob: 8500 },
  { value: 'gutters', label: 'Gutter Cleaning & Repair', emoji: '🌊', avgJob: 350 },
  { value: 'ev_charger', label: 'EV Charger Installation', emoji: '⚡', avgJob: 1200 },
  { value: 'hvac', label: 'HVAC', emoji: '❄️', avgJob: 1800 },
  { value: 'electrical', label: 'Electrical', emoji: '💡', avgJob: 900 },
  { value: 'landscaping', label: 'Landscaping', emoji: '🌿', avgJob: 400 },
  { value: 'pest_control', label: 'Pest Control', emoji: '🐜', avgJob: 300 },
  { value: 'pressure_washing', label: 'Pressure Washing', emoji: '💧', avgJob: 250 },
  { value: 'window_cleaning', label: 'Window Cleaning', emoji: '🪟', avgJob: 200 },
  { value: 'real_estate', label: 'Real Estate Agent', emoji: '🏡', avgJob: 10000 },
  { value: 'mortgage', label: 'Mortgage Broker', emoji: '🏦', avgJob: 3000 },
  { value: 'property_mgmt', label: 'Property Manager', emoji: '🏢', avgJob: 2400 },
  { value: 'adu_designer', label: 'ADU Designer / Architect', emoji: '📐', avgJob: 10000 },
  { value: 'adu_permit', label: 'ADU Permit Expediter', emoji: '📋', avgJob: 3500 },
  { value: 'solar', label: 'Solar Installer', emoji: '☀️', avgJob: 20000 },
  { value: 'window_door', label: 'Window & Door Installer', emoji: '🪟', avgJob: 10000 },
  { value: 'painter', label: 'Painter', emoji: '🎨', avgJob: 5000 },
];

const INDUSTRY_MESSAGES = {
  plumbing: {
    problem: 'When a pipe bursts, homeowners search Google or ask ChatGPT for the nearest trusted plumber. Stale reviews mean competitors get the call instead of you.',
    stat: '74% of new customers only trust reviews from the last 3 months.',
    win: '5 STAR COLLECTOR customers typically close their review gap in 60 days and pick up 5-8 new calls per month.',
  },
  roofing: {
    problem: 'Roofing is one of the biggest purchases a homeowner makes. They research hard before calling anyone. If your reviews are old or sparse, they move on to someone they can trust.',
    stat: '93% of consumers have made a purchase after reading reviews — and roofing is no exception.',
    win: '5 STAR COLLECTOR customers build the kind of review profile that wins high-ticket roofing jobs consistently.',
  },
  gutters: {
    problem: 'Homeowners searching for gutter cleaning compare multiple providers before calling. Whoever has more recent, positive reviews gets the job.',
    stat: '74% of customers only trust reviews from the last 3 months.',
    win: '5 STAR COLLECTOR customers typically see more inbound calls within 60 days of consistent review collection.',
  },
  ev_charger: {
    problem: 'EV charger installation is a new, fast-growing category. Homeowners are searching right now and have no brand loyalty. Fresh reviews are the only trust signal they have.',
    stat: '45% of consumers now use ChatGPT for local business recommendations — and EV charger searches are growing fast.',
    win: '5 STAR COLLECTOR customers get ahead of competitors early in this market by building reviews now.',
  },
  hvac: {
    problem: 'When the AC goes out in July, homeowners call fast — and they call whoever looks most trusted online. Old reviews lose you jobs to competitors with fresher ones.',
    stat: '19% of customers now expect a review response the same day. HVAC customers move even faster.',
    win: '5 STAR COLLECTOR customers stay visible and trusted during peak season when it matters most.',
  },
  electrical: {
    problem: 'Electrical work requires trust. Homeowners want proof you are licensed, reliable, and responsive. Reviews are how they verify that before calling.',
    stat: '47% of customers will not use a business with fewer than 20 reviews.',
    win: '5 STAR COLLECTOR customers build the review volume that makes homeowners confident enough to call.',
  },
  landscaping: {
    problem: 'Landscaping is highly visual and highly competitive. Homeowners compare providers on Google and ChatGPT. Whoever has the most recent positive reviews wins the call.',
    stat: '45% of consumers now use ChatGPT for local business recommendations.',
    win: '5 STAR COLLECTOR customers consistently outrank local competitors with fresher, more frequent reviews.',
  },
  pest_control: {
    problem: 'Pest problems feel urgent. Homeowners search fast and call the most trusted option they find. If your reviews are stale, that call goes to your competitor.',
    stat: '74% of customers only trust reviews from the last 3 months.',
    win: '5 STAR COLLECTOR customers stay top of mind with fresh reviews that capture urgent searchers.',
  },
  pressure_washing: {
    problem: 'Pressure washing is a repeat business. Homeowners who had a great experience need a nudge to leave a review — and that review gets you the next job.',
    stat: '83% of customers asked to leave a review actually do it.',
    win: '5 STAR COLLECTOR customers automate the ask so no job goes unreviewed.',
  },
  window_cleaning: {
    problem: 'Window cleaning is a crowded local market. The businesses winning new customers are the ones with the most visible, recent reviews on Google and ChatGPT.',
    stat: '45% of consumers now use ChatGPT for local business recommendations.',
    win: '5 STAR COLLECTOR customers stand out in a crowded market with a steady stream of fresh reviews.',
  },
  real_estate: {
    problem: 'Buyers and sellers Google their agent before they ever make contact. If your reviews are old, sparse, or unanswered, they move on to someone who looks more active and trusted.',
    stat: '74% of consumers only trust reviews from the last 3 months — and a home is the biggest purchase of their life.',
    win: '5 STAR COLLECTOR customers build the kind of review profile that makes clients choose them before the first conversation.',
  },
  mortgage: {
    problem: 'Borrowers are stressed and doing their homework. They search for mortgage brokers on Google and ChatGPT and call whoever looks most credible. Old reviews lose you deals worth thousands.',
    stat: '45% of consumers now use ChatGPT for local recommendations — including finding their mortgage broker.',
    win: '5 STAR COLLECTOR customers stay visible and trusted so borrowers reach out to them first.',
  },
  property_mgmt: {
    problem: 'Property owners searching for a manager want proof of reliability before handing over their investment. Recent, positive reviews are the fastest way to build that trust.',
    stat: '93% of consumers have made a purchase after reading reviews — and property management is no different.',
    win: '5 STAR COLLECTOR customers consistently win new management contracts by looking more credible than competitors online.',
  },
  adu_designer: {
    problem: 'Homeowners choose their ADU designer based on portfolio and trust. Reviews are how they verify you deliver. Without recent feedback, they pick a designer with a proven paper trail.',
    stat: '93% of consumers have made a purchase after reading reviews — for a $10,000 design fee, they read every single one.',
    win: '5 STAR COLLECTOR customers build a review profile that converts high-intent ADU prospects into design clients.',
  },
  adu_permit: {
    problem: 'ADU permit expediters live and die by referrals and reputation. Homeowners searching for help navigating California permits want proof you have done it before. Old reviews make them nervous.',
    stat: '47% of customers will not use a business with fewer than 20 reviews — and permit work requires serious trust.',
    win: '5 STAR COLLECTOR customers build the review volume that makes homeowners confident enough to hand over their permit process.',
  },
  solar: {
    problem: 'Solar is a $20,000+ decision. Homeowners spend weeks researching before calling anyone. If your reviews are thin or stale, they choose an installer with more social proof — even if your price is better.',
    stat: '74% of consumers only trust reviews from the last 3 months — and solar buyers research longer than almost anyone.',
    win: '5 STAR COLLECTOR customers build the review profile that wins high-ticket solar installs consistently in a competitive Bay Area market.',
  },
  window_door: {
    problem: 'Window and door installs are a significant investment. Homeowners want proof you show up, do clean work, and stand behind it. Recent reviews are the fastest way to prove that before the first call.',
    stat: '93% of consumers have made a purchase after reading reviews — and home improvement is one of the top categories.',
    win: '5 STAR COLLECTOR customers stay visible and trusted so homeowners reach out to them first.',
  },
  painter: {
    problem: 'Painting is one of the most competitive home service markets. Homeowners get 3-5 quotes and go with whoever looks most trustworthy. Fresh reviews tip the decision in your favor.',
    stat: '74% of customers only trust reviews from the last 3 months — and painters with recent reviews win the quote comparison.',
    win: '5 STAR COLLECTOR customers consistently outbook local competitors with a steady stream of fresh, verified reviews.',
  },
};

export default function FiveStarCalculator() {
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [jobValue, setJobValue] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [results, setResults] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBusinessTypeChange = (value) => {
    setBusinessType(value);
    const selected = BUSINESS_TYPES.find(b => b.value === value);
    if (selected && !jobValue) setJobValue(selected.avgJob.toString());
  };

  const searchBusiness = async () => {
    if (!businessName || !city || !jobValue || !businessType) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const prompt = `Search Google for this business and return its basic profile:

Business Name: ${businessName}
Location: ${city}

Find the most likely match and return ONLY this JSON:
{
  "name": "exact business name as it appears on Google",
  "address": "full street address",
  "phone": "phone number or empty string",
  "reviews": 0,
  "rating": 0.0,
  "found": true
}

If you cannot find the business return: { "found": false }`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse response');
      const found = JSON.parse(jsonMatch[0]);
      if (!found.found) {
        setError("We couldn't find that business. Try adding your city and state (e.g. Newark, CA).");
        return;
      }
      setConfirmData(found);
      setConfirming(true);
    } catch (err) {
      setError('Unable to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeBusinesses = async () => {
    setLoading(true);
    setError('');
    const selectedType = BUSINESS_TYPES.find(b => b.value === businessType);
    try {
      const searchContext = searchPhrase
        ? `Search Google for "${searchPhrase}" and find the top 2-3 businesses that appear in results. These are the competitors.`
        : `Find 2-3 top competitor ${selectedType?.label} businesses in ${city}.`;

      const prompt = `You are a local business analyst. Using this confirmed business, find competitor data:

Business: ${confirmData.name}
Address: ${confirmData.address}
Business Type: ${selectedType?.label}
Location: ${city}
Google Reviews: ${confirmData.reviews}
Rating: ${confirmData.rating}
${searchPhrase ? `Customer Search Phrase: "${searchPhrase}"` : ''}

${searchContext}

For each competitor find their review count and most recent review date.
${searchPhrase ? `Also note whether "${confirmData.name}" appears in the search results for "${searchPhrase}".` : ''}

Return ONLY this JSON:
{
  "business": { "name": "${confirmData.name}", "reviews": ${confirmData.reviews}, "rating": ${confirmData.rating}, "mostRecentDays": 0 },
  "competitors": [{ "name": "string", "reviews": 0, "mostRecentDays": 0 }],
  "analysis": { "reviewGap": 0, "recencyGap": 0, "estimatedLostJobs": 0, "hasGMB": ${confirmData.reviews > 0}, "appearsInSearch": false },
  "searchPhrase": "${searchPhrase || ''}"
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse response');
      const analysisData = JSON.parse(jsonMatch[0]);
      setResults({
        ...analysisData,
        jobValue: parseFloat(jobValue),
        monthlyLoss: analysisData.analysis.estimatedLostJobs * parseFloat(jobValue),
        businessType,
        messages: INDUSTRY_MESSAGES[businessType],
        searchPhrase: searchPhrase || null,
      });
      setConfirming(false);
    } catch (err) {
      setError('Unable to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(window.location.href + '?ref=friend');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber) { setError('Please enter your phone number'); return; }
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false); setResults(null); setBusinessName('');
    setCity(''); setJobValue(''); setBusinessType(''); setPhoneNumber('');
    setError(''); setConfirming(false); setConfirmData(null); setSearchPhrase('');
  };

  if (confirming && confirmData) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }} className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <p className="text-gray-500 text-sm mb-2">We found this business on Google:</p>
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-bold text-black mb-1">{confirmData.name}</h2>
            {confirmData.address && <p className="text-gray-600 text-sm mb-1">{confirmData.address}</p>}
            {confirmData.phone && <p className="text-gray-600 text-sm mb-3">{confirmData.phone}</p>}
            <div className="flex gap-4">
              <div className="bg-black rounded-lg px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">{confirmData.reviews}</div>
                <div className="text-xs text-gray-400">Google Reviews</div>
              </div>
              <div className="bg-black rounded-lg px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">{confirmData.rating}★</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
            </div>
          </div>
          <p className="text-black font-semibold text-center mb-4">Is this your business?</p>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            onClick={analyzeBusinesses}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 mb-3"
          >
            {loading ? <><Loader size={20} className="animate-spin" /> Analyzing...</> : "Yes, that's me — show my results"}
          </button>
          <button
            onClick={() => { setConfirming(false); setConfirmData(null); setError('Try adding more detail to your business name or location.'); }}
            className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:border-black hover:text-black transition-colors text-sm"
          >
            Not my business — search again
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }} className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">Got it!</h2>
          <p className="text-gray-700 mb-8">We will call <span className="font-semibold">{phoneNumber}</span> within 24 hours to show you exactly how to close this gap.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Share2 size={18} className="text-black" />
              <h3 className="font-bold text-black">Know another business owner?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Send them this link. You get <span className="font-semibold text-black">$40 cash</span> when they sign up.</p>
            <button onClick={handleCopyReferral} className="w-full bg-black text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-900 transition-colors">
              {copied ? '✓ Copied!' : 'Copy My Referral Link'}
            </button>
          </div>
          <button onClick={resetForm} className="text-gray-500 underline text-sm">Analyze another business</button>
        </div>
      </div>
    );
  }

  if (results) {
    const hasGMB = results.analysis.hasGMB;
    const maxReviews = Math.max(results.business.reviews, ...results.competitors.map(c => c.reviews), 50);
    const steps = [
      !hasGMB && {
        number: '01', title: 'Set up your Google Business Profile',
        description: "You can't collect reviews without one. Takes about 20 minutes and it's free.",
        link: 'https://business.google.com', linkText: 'Set it up free →',
      },
      { number: hasGMB ? '01' : '02', title: 'Ask every customer for a review', description: 'After every job, send a text with a direct link to your Google review page. Most customers will leave one if you just ask. Most owners never do.' },
      { number: hasGMB ? '02' : '03', title: 'Reply to every review', description: 'Google rewards businesses that respond. 74% of customers check if you reply before calling. Even a simple thank you counts.' },
    ].filter(Boolean);

    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }} className="min-h-screen bg-black p-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{BUSINESS_TYPES.find(b => b.value === results.businessType)?.emoji}</span>
              <h1 className="text-3xl font-bold text-black">{results.business.name}</h1>
            </div>
            <div className="flex items-center gap-1 ml-9 mb-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.round(results.business.rating) ? '#F59E0B' : '#D1D5DB' }} className="text-lg">★</span>
              ))}
              <span className="text-gray-500 text-sm ml-1">{results.business.rating} stars</span>
            </div>
            <p className="text-gray-500 mb-6 ml-9">{city}</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-black rounded-lg p-4 text-center"><div className="text-3xl font-bold text-white">{results.business.reviews}</div><div className="text-xs text-gray-400 mt-1">Google Reviews</div></div>
              <div className="bg-black rounded-lg p-4 text-center"><div className="text-3xl font-bold" style={{ color: '#F59E0B' }}>{results.business.rating}★</div><div className="text-xs text-gray-400 mt-1">Star Rating</div></div>
              <div className="bg-black rounded-lg p-4 text-center"><div className="text-3xl font-bold text-white">{results.business.mostRecentDays}d</div><div className="text-xs text-gray-400 mt-1">Since Last Review</div></div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">The Problem</h3>
                  <p className="text-red-800 text-sm">{results.messages.problem}</p>
                  <p className="text-red-700 text-xs mt-2 font-medium">{results.messages.stat}</p>
                </div>
              </div>
            </div>

            {results.searchPhrase && (
              <div className="bg-gray-950 rounded-xl p-5 mb-8" style={{ background: '#0f0f0f' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white text-sm font-semibold">🔍</span>
                  <span className="text-gray-400 text-xs">When your customer searches...</span>
                </div>
                <p className="text-white font-bold text-lg mb-4">"{results.searchPhrase}"</p>
                <div className="space-y-2 mb-4">
                  {results.competitors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-400 text-xs font-bold">#{i + 1}</span>
                      <span className="text-gray-300 text-sm">{c.name}</span>
                      <span className="text-gray-500 text-xs ml-auto">{c.reviews} reviews</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 opacity-40">
                    <span className="text-red-400 text-xs font-bold">—</span>
                    <span className="text-gray-400 text-sm line-through">{results.business.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">not showing</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs">Fresh reviews = showing up here. That's what we fix.</p>
              </div>
            )}
            <div className="mb-8">
              <h3 className="font-bold text-black mb-4">Your Reviews vs. Competitors</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-black text-sm">{results.business.name} <span className="text-xs text-gray-500 font-normal">(you)</span></span>
                    <span className="text-xs text-gray-600">{results.business.reviews} reviews · {results.business.mostRecentDays}d ago</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-black h-3 rounded-full" style={{ width: `${Math.max(15, (results.business.reviews / maxReviews) * 100)}%` }}></div></div>
                </div>
                {results.competitors.map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-black text-sm">{c.name}</span>
                      <span className="text-xs text-gray-600">{c.reviews} reviews · {c.mostRecentDays}d ago</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gray-400 h-3 rounded-full" style={{ width: `${(c.reviews / maxReviews) * 100}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4"><TrendingUp className="text-white" size={20} /><h3 className="font-bold text-white text-lg">What This Costs You</h3></div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Estimated lost {['real_estate','mortgage','property_mgmt','adu_designer','adu_permit','solar'].includes(results.businessType) ? 'clients' : 'jobs'}/month</span><span className="font-bold text-white">{results.analysis.estimatedLostJobs}–{Math.round(results.analysis.estimatedLostJobs * 1.5)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Your average job value</span><span className="font-bold text-white">${results.jobValue.toLocaleString()}</span></div>
                <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                  <span className="text-gray-200 font-semibold">Monthly revenue loss</span>
                  <span className="font-bold text-2xl text-white">${Math.round(results.monthlyLoss).toLocaleString()}</span>
                </div>
                <div className="text-right"><span className="text-gray-500 text-xs">That's ${Math.round(results.monthlyLoss * 12).toLocaleString()}/year</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-black mb-2">Here's What To Do About It</h2>
            <p className="text-gray-500 text-sm mb-6">You have {steps.length} things to fix. Here's how to do it yourself — or we handle all of it for you.</p>
            <div className="space-y-4 mb-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                  <div className="text-2xl font-black text-gray-200 w-10 flex-shrink-0">{step.number}</div>
                  <div>
                    <h3 className="font-bold text-black mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    {step.link && <a href={step.link} target="_blank" rel="noreferrer" className="text-black font-semibold text-sm underline mt-1 inline-block">{step.linkText}</a>}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-gray-100"></div></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-gray-400 text-sm font-semibold">OR</span></div>
            </div>
            <div className="bg-black rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: '#F59E0B' }} className="text-lg">★★★★★</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">We handle all of it for you</h3>
              <p className="text-gray-400 text-sm mb-4">5 STAR COLLECTOR sets everything up, sends review requests automatically, and writes personalized responses to every review. You just do the work you love.</p>
              <div className="flex gap-6 mb-4">
                <div><div className="text-2xl font-black text-white">$197</div><div className="text-gray-500 text-xs">one-time setup</div></div>
                <div><div className="text-2xl font-black text-white">$49<span className="text-lg">/mo</span></div><div className="text-gray-500 text-xs">we handle everything</div></div>
              </div>
              <div className="space-y-1">
                {[!hasGMB && '✓ Google Business Profile setup', '✓ Automated review requests after every job', '✓ Personalized responses written for every review', '✓ Monthly performance report'].filter(Boolean).map((item, i) => (
                  <p key={i} className="text-gray-300 text-sm">{item}</p>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">Drop your number. We will call within 24 hours.</p>
            <div className="flex gap-3">
              <input type="tel" placeholder="(555) 123-4567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-400" />
              <button onClick={handlePhoneSubmit} className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap">
                <Phone size={18} /> Call Me
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-2"><Share2 size={18} className="text-black" /><h3 className="font-bold text-black">Know another business owner?</h3></div>
            <p className="text-gray-600 text-sm mb-4">Send them this tool. You get <span className="font-semibold text-black">$40 cash</span> when they sign up.</p>
            <button onClick={handleCopyReferral} className="w-full border-2 border-black text-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors text-sm">
              {copied ? '✓ Link Copied!' : 'Copy My Referral Link'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }} className="min-h-screen bg-black p-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#F59E0B' }} className="text-2xl">★★★★★</span>
          </div>
          <h1 className="text-3xl font-bold text-black mb-1">5 STAR COLLECTOR</h1>
          <p className="text-gray-600 text-sm mb-8">See how much revenue you are leaving on the table.</p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Business Type</label>
              <div className="relative">
                <select value={businessType} onChange={(e) => handleBusinessTypeChange(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black appearance-none cursor-pointer">
                  <option value="">Select your business type...</option>
                  {BUSINESS_TYPES.map(type => <option key={type.value} value={type.value}>{type.emoji} {type.label}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Business Name</label>
              <input type="text" placeholder="e.g., ABC Plumbing" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">City, State or Zip Code</label>
              <input type="text" placeholder="e.g., Fremont, CA or 94538" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-400" />
              <p className="text-xs text-gray-500 mt-1">More specific = more accurate results</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                What do your customers search for? <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder='e.g., "plumber Newark CA" or "ADU contractor Fremont"'
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">We'll show who's beating you for that search</p>
            </div>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">$</span>
                <input type="number" placeholder="e.g., 650" value={jobValue} onChange={(e) => setJobValue(e.target.value)} className="w-full px-4 py-3 pl-8 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-400" />
              </div>
              {businessType && <p className="text-xs text-gray-500 mt-1">Average for {BUSINESS_TYPES.find(b => b.value === businessType)?.label}: ${BUSINESS_TYPES.find(b => b.value === businessType)?.avgJob.toLocaleString()}</p>}
            </div>
          </div>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <button onClick={searchBusiness} disabled={loading} className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
            {loading ? <><Loader size={20} className="animate-spin" /> Analyzing...</> : 'Analyze My Business'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Takes about 15 seconds</p>
        </div>
      </div>
    </div>
  );
}
