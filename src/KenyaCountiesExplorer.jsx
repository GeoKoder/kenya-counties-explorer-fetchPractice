
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import "./KenyaCountiesExplorer.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function KenyaCountiesExplorer() {
  // 1. Fetch posts and track loading and errors.
  const {
    data: posts,
    loading,
    error,
  } = useFetch(API_URL);

  // 2. Store what the user types.
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Store the last-updated timestamp.
  const [lastUpdated, setLastUpdated] = useState(
    () => new Date()
  );

  // 4. Refresh the timestamp every 30 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    // Clean up the interval when the component unmounts.
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // 5. Filter posts by title, ignoring letter case.
  const safePosts = Array.isArray(posts) ? posts : [];

  const filteredPosts = safePosts.filter((post) =>
    post.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  // 6. Display no more than 20 matching posts.
  const displayedPosts = filteredPosts.slice(0, 20);

  // 7. Display a loading spinner while fetching.
  if (loading) {
    return (
      <main className="explorer">
        <h1>Kenya Counties Explorer</h1>

        <div className="loading-container" role="status">
          <div className="spinner"></div>
          <p>Loading county updates...</p>
        </div>
      </main>
    );
  }

  // 8. Display an error if fetching fails.
  if (error) {
    return (
      <main className="explorer">
        <h1>Kenya Counties Explorer</h1>

        <div className="error-message" role="alert">
          <h2>Unable to load county updates</h2>
          <p>{error}</p>
          <p>Please check your connection and try again later.</p>
        </div>
      </main>
    );
  }

  // 9. Display the search, count, timestamp, and results.
  return (
    <main className="explorer">
      <header className="explorer-header">
        <h1>Kenya Counties Explorer</h1>

        <p className="subtitle">
          Explore and search county updates.
        </p>

        <p className="last-updated">
          Last updated:{" "}
          <time dateTime={lastUpdated.toISOString()}>
            {lastUpdated.toLocaleTimeString()}
          </time>
        </p>
      </header>

      <section className="search-section">
        <label htmlFor="county-search">
          Search county updates by title
        </label>

        <input
          id="county-search"
          type="search"
          placeholder="Type a title to search..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <p className="result-count" aria-live="polite">
          {filteredPosts.length}{" "}
          {filteredPosts.length === 1 ? "result" : "results"} found
        </p>
      </section>

      <section className="posts-list" aria-label="County updates">
        {displayedPosts.length === 0 ? (
          <p className="empty-message">
            No county updates match your search.
          </p>
        ) : (
          displayedPosts.map((post) => (
            <article className="post-card" key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          ))
        )}
      </section>

      {filteredPosts.length > 20 && (
        <p className="limit-message">
          Showing the first 20 of {filteredPosts.length} matching
          results.
        </p>
      )}
    </main>
  );
}

export default KenyaCountiesExplorer;
