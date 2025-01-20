// APIs.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function APIs() {
  const location = useLocation();
  const { selectedCategories, spaces, customCategory } = location.state; // Data passed from Categories.js

  const [selectedLanguage, setSelectedLanguage] = useState('HTML'); // Default language is HTML

  const generateApiCode = (space, categoryId, language) => {
    if (language === 'HTML') {
      return `<script src="https://example.com/api/ads?space=${space}&category=${categoryId}"></script>`;
    } else if (language === 'JavaScript') {
      return `<script>\n(function() {\n  var ad = document.createElement('script');\n  ad.src = "https://example.com/api/ads?space=${space}&category=${categoryId}";\n  document.getElementById("${space}-ad").appendChild(ad);\n})();\n</script>`;
    } else if (language === 'PHP') {
      return `<?php echo '<div id="${space}-ad"><script src="https://example.com/api/ads?space=${space}&category=${categoryId}"></script></div>'; ?>`;
    } else if (language === 'Python') {
      return `print('<div id="${space}-ad"><script src="https://example.com/api/ads?space=${space}&category=${categoryId}"></script></div>')`;
    } else {
      return 'Language not supported';
    }
  };

  // Render API code for each selected space in different languages
  const renderApiCodes = (category, spaces, categoryId) => {
    // Only consider actual ad spaces like 'header', 'sidebar' for API generation
    return Object.keys(spaces)
      .filter(spaceType => ['header', 'sidebar'].includes(spaceType)) // Filter to include only the actual space types
      .map((spaceType) => (
        <div key={spaceType}>
          <h4>{spaceType.charAt(0).toUpperCase() + spaceType.slice(1)} Space</h4>
          <pre>{generateApiCode(spaceType, categoryId, selectedLanguage)}</pre>
        </div>
      ));
  };
  

  return (
    <div>
      <h2>Generated APIs</h2>
      <div>
        <label htmlFor="language-select">Select Language: </label>
        <select id="language-select" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option value="HTML">HTML</option>
          <option value="JavaScript">JavaScript</option>
          <option value="PHP">PHP</option>
          <option value="Python">Python</option>
        </select>
      </div>

      {selectedCategories.banner && (
        <div>
          <h3>Banner Category</h3>
          {renderApiCodes('banner', spaces.banner, selectedCategories.banner.id)} {/* Use actual category ID */}
        </div>
      )}

      {selectedCategories.popup && (
        <div>
          <h3>Pop-up Category</h3>
          {renderApiCodes('popup', spaces.popup, selectedCategories.popup.id)} {/* Use actual category ID */}
        </div>
      )}

      {selectedCategories.custom && (
        <div>
          <h3>{customCategory.name}</h3>
          {renderApiCodes('custom', spaces.custom, 'custom-category-id')}
        </div>
      )}
    </div>
  );
}

export default APIs;