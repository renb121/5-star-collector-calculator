export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessName, city, businessType } = req.body;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Google Places API key not configured' });
  }

  if (!businessName || !city) {
    return res.status(400).json({ error: 'Business name and city are required' });
  }

  async function searchPlaces(query, maxResults = 1) {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.reviews'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: maxResults
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.places && data.places.length > 0 ? data.places : null;
  }

  try {
    const cleanName = businessName
      .replace(/\b(LLC|Inc|Corp|Co|Company|Ltd)\b\.?/gi, '')
      .replace(/[,.\s]+$/, '')
      .trim();

    const searchAttempts = [
      `${businessName} ${city}`,
      `${cleanName} ${city}`,
      `${cleanName}, ${city}`,
      businessName,
      cleanName,
      `"${cleanName}" ${city}`,
    ];

    let business = null;
    let attemptUsed = '';

    for (const query of searchAttempts) {
      const results = await searchPlaces(query, 1);
      if (results && results.length > 0) {
        business = results[0];
        attemptUsed = query;
        break;
      }
    }

    if (!business) {
      return res.status(404).json({ 
        found: false,
        error: 'Business not found',
        message: 'We could not find that business on Google. Try a more specific name or include the full address.'
      });
    }

    let mostRecentDays = null;
    if (business.reviews && business.reviews.length > 0) {
      const mostRecent = business.reviews.reduce((latest, review) => {
        const reviewDate = new Date(review.publishTime);
        return !latest || reviewDate > latest ? reviewDate : latest;
      }, null);
      if (mostRecent) {
        mostRecentDays = Math.floor((Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    const businessTypeQueries = {
      plumbing: 'plumber',
      roofing: 'roofing contractor',
      gutters: 'gutter installation',
      hvac: 'HVAC contractor',
      electrical: 'electrician',
      landscaping: 'landscaper',
      pest_control: 'pest control',
      pressure_washing: 'pressure washing',
      window_cleaning: 'window cleaning',
      solar: 'solar installer',
      painter: 'painter',
      kitchen_remodel: 'kitchen remodeling',
      bathroom_remodel: 'bathroom remodeling',
      general_contractor: 'general contractor',
      flooring: 'flooring contractor',
      drywall: 'drywall contractor',
      tile: 'tile installer',
      real_estate: 'real estate agent',
      mortgage: 'mortgage broker',
      property_mgmt: 'property management',
      adu_designer: 'ADU designer',
      adu_permit: 'permit expediter',
    };

    const competitorQuery = `${businessTypeQueries[businessType] || businessType} ${city}`;
    const competitorResults = await searchPlaces(competitorQuery, 5);
    
    let competitors = [];
    if (competitorResults) {
      competitors = competitorResults
        .filter(p => p.id !== business.id)
        .slice(0, 3)
        .map(p => ({
          name: p.displayName?.text || 'Unknown',
          reviews: p.userRatingCount || 0,
          rating: p.rating || 0
        }));
    }

    return res.status(200).json({
      found: true,
      business: {
        name: business.displayName?.text || businessName,
        address: business.formattedAddress || '',
        phone: business.nationalPhoneNumber || '',
        reviews: business.userRatingCount || 0,
        rating: business.rating || 0,
        mostRecentDays: mostRecentDays !== null ? mostRecentDays : 999
      },
      competitors,
      searchUsed: attemptUsed
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message
    });
  }
}
