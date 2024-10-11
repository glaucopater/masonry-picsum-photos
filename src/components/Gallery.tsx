import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import './Gallery.css';

interface Image {
  id: string;
  width: number;
  height: number;
  author: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const lastImageElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=30`);
      const newImages = response.data;

      setImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 3,
    500: 3,
  };

  const getRandomSize = () => {
    const sizes = [
      { width: 300, height: 200 },  // landscape
      { width: 200, height: 300 },  // portrait
      { width: 250, height: 250 },  // square
    ];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="gallery">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {images.map((image, index) => {
          const { width, height } = getRandomSize();
          return (
            <div
              key={`${image.id}-${index}`}
              ref={index === images.length - 1 ? lastImageElementRef : null}
            >
              <Link
                to={`/image/${image.id}`}
                state={{
                  images: images.map((img) => img.id),
                  currentIndex: index,
                }}
              >
                <img 
                  src={`https://picsum.photos/id/${image.id}/${width}/${height}`} 
                  alt={`Photo by ${image.author}`}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Link>
            </div>
          );
        })}
      </Masonry>
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default Gallery;