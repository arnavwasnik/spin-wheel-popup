Spin Wheel Popup Component (arnav)

Project Structure

*App.jsx
Contains the main React component. It defines the spin wheel logic, rendering, and reward calculation.
The popup appears with animation, includes a spin limit, and supports a close (X) button.

*styles.css
Contains all styling for the popup, wheel layout, spin button, and animations.
Designed to be lightweight, transparent, and overlay on top of any existing UI.

Integration Notes for Backend

Import App.jsx into the main layout or homepage container.

Ensure styles.css is imported once globally (or locally in App.jsx).

The component is self-contained and triggers automatically when loaded.

To send reward results to backend, insert an API call inside the getResult() method in App.jsx.

No extra configuration or dependencies are needed beyond React and CSS.
