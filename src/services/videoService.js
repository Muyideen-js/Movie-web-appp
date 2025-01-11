const API_URL = 'http://localhost:3001';

export const videoService = {
  login: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        })
      });

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.token;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  getVideoUrl: async (movieId) => {
    try {
      // Ensure we have a token
      if (!localStorage.getItem('token')) {
        await videoService.login();
      }

      // Test if video exists first
      const response = await fetch(`${API_URL}/stream/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 401) {
        await videoService.login(); // Token expired, try login again
        return videoService.getVideoUrl(movieId);
      }

      if (!response.ok) {
        throw new Error(`Video not available (Status: ${response.status})`);
      }

      return {
        url: `${API_URL}/stream/${movieId}`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to load video');
    }
  },

  updateProgress: async (movieId, progress) => {
    try {
      if (!localStorage.getItem('token')) {
        await videoService.login();
      }

      await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ movieId, progress })
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }
}; 