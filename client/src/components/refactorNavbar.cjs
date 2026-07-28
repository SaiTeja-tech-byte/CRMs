const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'Navbar.jsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// 2. We need a standardized mega menu generator.
function generateMegaMenuJSX(stateName, dataArrayName, megaClass, activeIdState, setActiveIdFn) {
  return `{${stateName} && (
                <div className="mega-dropdown ${megaClass}">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card ${megaClass.replace('-mega', '-card')}">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {${dataArrayName}.map((item) => (
                        <button
                          key={item.id}
                          className={\`mega-tab-btn \${${activeIdState} === item.id ? "active" : ""}\`}
                          onMouseEnter={() => ${setActiveIdFn}(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = ${dataArrayName}.find(i => i.id === ${activeIdState}) || ${dataArrayName}[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={\`col1-\${activeItem.id}\`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={\`col2-\${activeItem.id}\`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={\`col3-\${activeItem.id}\`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}`;
}

function replaceBlock(str, startMarker, endRegex, replacement) {
  const startIndex = str.indexOf(startMarker);
  if (startIndex === -1) {
    console.log("Could not find start marker:", startMarker);
    return str;
  }
  
  const remainingStr = str.slice(startIndex);
  const match = remainingStr.match(endRegex);
  
  if (!match) {
    console.log("Could not find end regex:", endRegex);
    return str;
  }
  
  const endIndex = startIndex + match.index;
  return str.slice(0, startIndex) + replacement + '\n              ' + str.slice(endIndex);
}

// 3. Replace the JSX blocks in the render
content = replaceBlock(
  content,
  '{industriesDropdownOpen && (',
  /<\/div>\s*\{\/\* Customers Dropdown Trigger \*\/\}/,
  generateMegaMenuJSX("industriesDropdownOpen", "industriesData", "industries-mega", "activeIndustryId", "setActiveIndustryId")
);

content = replaceBlock(
  content,
  '{customersDropdownOpen && (',
  /<\/div>\s*\{\/\* Resources Dropdown Trigger \*\/\}/,
  generateMegaMenuJSX("customersDropdownOpen", "customersData", "customers-mega", "activeCustomerTab", "setActiveCustomerTab")
);

content = replaceBlock(
  content,
  '{learningDropdownOpen && (',
  /<\/div>\s*\{\/\* Support Dropdown Trigger \*\/\}/,
  generateMegaMenuJSX("learningDropdownOpen", "learningData", "learning-mega", "activeLearningTab", "setActiveLearningTab")
);

content = replaceBlock(
  content,
  '{supportDropdownOpen && (',
  /<\/div>\s*\{\/\* Company Dropdown Trigger \*\/\}/,
  generateMegaMenuJSX("supportDropdownOpen", "supportData", "support-mega", "activeSupportTab", "setActiveSupportTab")
);

content = replaceBlock(
  content,
  '{companyDropdownOpen && (',
  /<\/div>\s*<\/div>\s*<\/div>\s*<div className="nav-top-right">/,
  generateMegaMenuJSX("companyDropdownOpen", "companyData", "company-mega", "activeCompanyTab", "setActiveCompanyTab")
);

content = replaceBlock(
  content,
  '{crmDropdownOpen && (',
  /<\/div>\s*<a href="#solutions" className="has-dropdown">/,
  generateMegaMenuJSX("crmDropdownOpen", "crmData", "what-is-crm-mega", "activeCrmTab", "setActiveCrmTab")
);


// 4. Update CSS 
const cssStartMarker = '/* Industries Mega Menu Specifics */';
const cssEndMarker = '</style>';
const cssStartIndex = content.indexOf(cssStartMarker);
const cssEndIndex = content.indexOf(cssEndMarker, cssStartIndex);

console.log(cssStartIndex, cssEndIndex);

if (cssStartIndex !== -1 && cssEndIndex !== -1) {
  const newCss = `/* Standardized Mega Menu Styles */
.mega-dropdown-card {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #E2E8F0;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Top Horizontal Tabs */
.mega-top-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E2E8F0;
  padding: 0 32px;
  background: #F8FAFC;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.mega-tab-btn {
  background: transparent;
  border: none;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  flex: 1;
  text-align: center;
}

.mega-tab-btn:hover {
  color: #032D60;
}

.mega-tab-btn.active {
  color: #0056D2;
}

.mega-tab-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0056D2;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.mega-tab-btn.active::after {
  transform: scaleX(1);
}

/* 3-Column Content Layout */
.mega-content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  padding: 32px;
  gap: 48px;
}

/* Column 1: Description & CTA */
.mega-col-1 h3 {
  font-size: 22px;
  font-weight: 700;
  color: #032D60;
  margin-bottom: 12px;
}

.mega-desc {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
}

.mega-cta-link {
  display: inline-flex;
  align-items: center;
  color: #0056D2;
  font-weight: 600;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s ease;
}

.mega-cta-link:hover {
  color: #0043A8;
  text-decoration: underline;
}

/* Column 2 & 3 Titles */
.mega-col-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748B;
  margin-bottom: 20px;
  font-weight: 700;
}

/* Features List (Checkmarks) */
.mega-feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mega-feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  color: #334155;
  font-weight: 500;
}

.mega-feature-list i {
  color: #0056D2;
  font-size: 18px;
  margin-top: -2px;
}

/* Resource List (Bullets) */
.mega-resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mega-resource-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  color: #334155;
  font-weight: 500;
}

.bullet-dot {
  color: #94A3B8;
  font-size: 16px;
  line-height: 1;
}

/* Shared Megamenu Positioning */
.industries-mega,
.customers-mega,
.learning-mega,
.support-mega,
.company-mega,
.what-is-crm-mega {
  width: 900px;
}

/* Adjust absolute positioning to center roughly */
.industries-mega { left: -150px !important; }
.customers-mega { left: -250px !important; }
.learning-mega { left: -350px !important; }
.support-mega { left: -450px !important; }
.company-mega { left: -550px !important; }
.what-is-crm-mega { left: -100px !important; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .mega-content-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .mega-col-3 {
    grid-column: span 2;
    margin-top: 16px;
    border-top: 1px solid #E2E8F0;
    padding-top: 24px;
  }
}
@media (max-width: 768px) {
  .mega-top-tabs {
    flex-wrap: wrap;
  }
  .mega-tab-btn {
    flex: 1 1 50%;
  }
}

`;
  
  content = content.slice(0, cssStartIndex) + newCss + '\n  ' + content.slice(cssEndIndex);
}

fs.writeFileSync(navbarPath, content);
console.log("Refactor complete.");
