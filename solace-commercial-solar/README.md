# Solace Commercial Solar

## Overview

A responsive landing page for a fictional commercial solar company. Its main feature is a savings estimator: a visitor enters their building address, monthly energy bill and facility type, and the page shows an illustrative savings report that can be downloaded as a PDF or printed. This is a concept project built for my portfolio.

## Features

- Responsive layout for mobile, tablet and desktop
- Mobile menu that closes when you click outside it
- Savings estimator with form validation
- Instant report: monthly savings, annual savings, annual bill and remaining bill
- Download the report as a PDF (jsPDF)
- Print-friendly styles that show only the report
- Reduced-motion support and keyboard focus styles

## Technologies

- HTML5
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- jsPDF 4.2.1 (loaded from the unpkg CDN)
- Google Fonts: DM Sans and DM Serif Display

## File Structure

solace-commercial-solar/
├── assets/ Project images (.webp)
├── css/
│ └── style.css All styles
├── js/
│ └── script.js Menu, estimator and PDF logic
├── index.html Page structure and content
└── README.md

## Installation

1. Clone the repository:
   git clone https://github.com/YOUR-USERNAME/solace-commercial-solar.git
2. Open the folder in VS Code.
3. Open index.html in a browser, or use the Live Server extension.

No build step or dependencies to install. An internet connection is needed for the fonts and the PDF library.

## Usage

1. Scroll to "Estimate your savings".
2. Enter an address, a monthly energy bill and a facility type.
3. Click "Calculate savings" to see the report.
4. Use "Download PDF" or "Print estimate".

## Customization

- Savings rate: change SAVINGS_RATE in js/script.js (currently 0.2 for 20%).
- Currency: change CURRENCY in js/script.js.
- Colours and fonts: edit the custom properties at the top of css/style.css.
- Contact email: replace hello@solace.example in index.html.

## Important Notes

The 20% savings rate is an assumption, so results are illustrative and not a formal engineering or financial proposal. The company, contact details and project examples are placeholders. The form runs entirely in the browser and nothing is sent to a server.

## Author

Built by Christian Dearson Sokari (CDS).
Live site: add your Netlify link here
