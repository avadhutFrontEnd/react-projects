import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../services/movieService";

class HeroSection extends Component {
  state = {
    currentSlide: 0,
    heroMovies: [],
    isLoading: true
  };

  // Hero images mapping
  heroImages = [
    {
      image: "/images/hero/hero-featured.png",
      title: "Jojo Rabbit",
      genre: "Comedy",
      year: "2019",
      description: "A World War II satire that follows a lonely German boy whose world view is turned upside down when he discovers his single mother is hiding a young Jewish girl in their attic."
    },
    {
      image: "/images/hero/hero-action.jpg",
      title: "Extraction",
      genre: "Action",
      year: "2020",
      description: "A hardened mercenary's mission becomes a soul-searching race to survive when he's sent into Bangladesh to rescue a drug lord's kidnapped son."
    },
    {
      image: "/images/hero/hero-drama.jpeg",
      title: "Unbreakable",
      genre: "Thriller",
      year: "2000",
      description: "A suspense thriller that follows David Dunn, a man who becomes the sole survivor of a devastating train crash and discovers he may have superhuman abilities."
    }
  ];

  componentDidMount() {
    this.loadHeroMovies();
    this.startAutoSlide();
  }

  componentWillUnmount() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  async loadHeroMovies() {
    try {
      const { data: movies } = await getMovies();
      // Find movies that match hero images
      const heroMovieTitles = ["Jojo Rabbit", "Extraction", "Unbreakable"];
      const matchedMovies = heroMovieTitles.map(title => 
        movies.find(m => m.title === title)
      ).filter(Boolean);

      // Merge with hero images data
      const heroMovies = this.heroImages.map((hero, index) => {
        const movie = matchedMovies[index] || null;
        return {
          ...hero,
          movie: movie,
          _id: movie?._id || null
        };
      });

      this.setState({ heroMovies, isLoading: false });
    } catch (error) {
      console.error("Error loading hero movies:", error);
      this.setState({ heroMovies: this.heroImages.map(h => ({ ...h, movie: null })), isLoading: false });
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  nextSlide = () => {
    this.setState(prevState => ({
      currentSlide: (prevState.currentSlide + 1) % this.heroImages.length
    }));
  };

  prevSlide = () => {
    this.setState(prevState => ({
      currentSlide: (prevState.currentSlide - 1 + this.heroImages.length) % this.heroImages.length
    }));
  };

  goToSlide = (index) => {
    this.setState({ currentSlide: index });
    // Reset auto-slide timer
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.startAutoSlide();
  };

  render() {
    const { currentSlide, heroMovies, isLoading } = this.state;
    
    if (isLoading) {
      return (
        <div className="hero-section" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--text-primary)" }}>Loading...</div>
        </div>
      );
    }

    const currentHero = heroMovies[currentSlide] || this.heroImages[currentSlide];

    return (
      <div className="hero-section">
        {/* Hero Slides */}
        <div className="hero-slides-container">
          {this.heroImages.map((hero, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${hero.image})`
              }}
            >
              <div className="hero-overlay" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-movie-info">
            <h1 className="hero-title">{currentHero.title}</h1>
            <div className="hero-meta">
              <span>18+</span> • <span>{currentHero.genre}</span> • <span>{currentHero.year}</span>
            </div>
            <p className="hero-description">
              {currentHero.description}
            </p>
            <div className="hero-buttons">
              <button className="hero-button hero-button-preview">
                <i className="fa fa-play" style={{ marginRight: "8px" }} />
                Preview
              </button>
              {currentHero.movie && (
                <Link
                  to={`/movies/${currentHero.movie._id}`}
                  className="hero-button hero-button-subscribe"
                  style={{ textDecoration: "none" }}
                >
                  Rent Now
                </Link>
              )}
              {!currentHero.movie && (
                <button className="hero-button hero-button-subscribe">
                  Subscribe
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="hero-nav-button hero-nav-prev"
          onClick={this.prevSlide}
          aria-label="Previous slide"
        >
          <i className="fa fa-chevron-left" />
        </button>
        <button 
          className="hero-nav-button hero-nav-next"
          onClick={this.nextSlide}
          aria-label="Next slide"
        >
          <i className="fa fa-chevron-right" />
        </button>

        {/* Pagination Dots */}
        <div className="hero-pagination">
          {this.heroImages.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => this.goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default HeroSection;
