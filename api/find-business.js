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

  function getDaysSinceLastReview(place) {
    if (!place.reviews || place.reviews.length === 0) return null;
    const mostRecent = place.reviews.reduce((latest, review) => {
      const reviewDate = new Date(review.publishTime);
      return !latest || reviewDate > latest ? reviewDate : latest;
    }, null);
    return mostRecent ? Math.floor((Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)) : null;
  }

  // Verify the match is actually a good match — not just any business with similar words
  function isGoodMatch(place, searchName) {
    if (!place.displayName?.text) return false;
    const placeName = place.displayName.text.toLowerCase();
    const search = searchName.toLowerCase()
      .replace(/\b(llc|inc|corp|co|company|ltd)\b\.?/gi, '')
      .replace(/[,.\s]+$/, '')
      .trim();

    // Get the most distinctive word from the search (longest non-generic word)
    const genericWords = ['the', 'and', 'company', 'service', 'services', 'group', 'cleaning', 'wash', 'washing', 'plumbing', 'roofing', 'hvac', 'electric', 'electrical', 'pressure', 'landscape', 'landscaping', 'real', 'estate', 'home', 'house', 'kitchen', 'bath', 'bathroom', 'building', 'builders', 'remodel', 'remodeling', 'construction'];
    const searchWords = search.split(/\s+/).filter(w => w.length > 2 && !genericWords.includes(w));
    
    // If no distinctive words, require the FULL business name to be in the result
    if (searchWords.length === 0) {
      return placeName.includes(search);
    }

    // Otherwise, require at least one distinctive word to appear in the place name
    return searchWords.some(word => placeName.includes(word));
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

  async function getCompetitors(excludeBusinessId = null) {
    const query = `${businessTypeQueries[businessType] || businessType} ${city}`;
    const results = await searchPlaces(query, 5);
    if (!results) return [];
    return results
      .filter(p => !excludeBusinessId || p.id !== excludeBusinessId)
      .slice(0, 3)
      .map(p => ({
        name: p.displayName?.text || 'Unknown',
        reviews: p.userRatingCount || 0,
        rating: p.rating || 0,
        mostRecentDays: getDaysSinceLastReview(p)
      }));
  }

  try {
    const cleanName = businessName
      .replace(/\b(LLC|Inc|Corp|Co|Company|Ltd)\b\.?/gi, '')
      .replace(/[,.\s]+$/, '')
      .trim();

    const searchAttempts = [
      `${businessName} ${city}`,
      `${cleanName} ${city}`,
      `"${cleanName}" ${city}`,
    ];

    let business = null;
    let attemptUsed = '';

    for (const query of searchAttempts) {
      const results = await searchPlaces(query, 1);
      if (results && results.length > 0 && isGoodMatch(results[0], businessName)) {
        business = results[0];
        attemptUsed = query;
        break;
      }
    }

    const competitors = await getCompetitors(business?.id);

    if (!business) {
      return res.status(200).json({ 
        found: false,
        message: 'Business not found in Google database',
        competitors
      });
    }

    let mostRecentDays = getDaysSinceLastReview(business);

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
