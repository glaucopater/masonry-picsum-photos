import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './FullScreenImage.css';

interface Image {
  id: string;
  download_url: string;
  author: string;
}

interface LocationState {
  images: string[];
  currentIndex: number;
}

const FullScreenImage: React.FC = () => {
  const [image, setImage] = useState<Image | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://picsum.photos/id/${id}/info`);
        setImage(response.data);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state && state.images) {
        const currentIndex = state.images.indexOf(id || '');
        if (event.key === 'ArrowLeft' && currentIndex > 0) {
          navigate(`/image/${state.images[currentIndex - 1]}`, { state });
        } else if (event.key === 'ArrowRight' && currentIndex < state.images.length - 1) {
          navigate(`/image/${state.images[currentIndex + 1]}`, { state });
        } else if (event.key === 'Escape') {
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, id, state]);

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-screen-image">
      <img src={image.download_url} alt={`Photo by ${image.author}`} />
    </div>
  );
};

export default FullScreenImage;