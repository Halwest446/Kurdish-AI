// chatService.js

export const sendMessage = async (message) => {
  try {
    console.log('Attempting to send message:', message);

    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    console.log('Response status:', response.status);
    
    // Get response text first for debugging
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Parse the response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing response:', e);
      throw new Error('Invalid response format');
    }

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    console.log('Parsed response data:', data);

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected response structure:', data);
      throw new Error('Invalid response structure');
    }

    return data.content[0].text;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};