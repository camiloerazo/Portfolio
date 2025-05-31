// src/lib/testUnsplash.ts

const accessKey = "p8pEY2CCXvpP2PDe5PT5XFf98WPRiYT4KL9yH_XcjOw";
const query = "a computer"; // Using a general query for testing

const fetchImage = async () => {
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}`);
    
    if (!res.ok) {
      const errorData = await res.text(); // Get error response body
      throw new Error(`Unsplash API error: ${res.status} ${res.statusText} - ${errorData}`);
    }

    const data = await res.json();
    const imageUrl = data.results[0]?.urls?.regular;
    
    if (imageUrl) {
        console.log("Successfully fetched image URL:", imageUrl);
    } else {
        console.log("No image URL found for the query:", query, "API Response:", data);
    }

    return imageUrl;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null; // Return null or undefined on error
  }
};

fetchImage(); // Execute the function to test it 