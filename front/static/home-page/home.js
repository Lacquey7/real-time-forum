// Home page functionality
export default class HomePage {
  constructor() {
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.id = 'home-container';
    this.createContent();
    document.body.appendChild(this.container);
  }

  createContent() {
    // Create welcome message
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
            <h1>Welcome to Real Time Forum</h1>
            <p>This is a test home page</p>
        `;

    // Create test buttons
    const buttonSection = document.createElement('div');
    buttonSection.className = 'button-section';

    const testButton = document.createElement('button');
    testButton.textContent = 'Test Button';
    testButton.addEventListener('click', () => this.handleTestClick());

    buttonSection.appendChild(testButton);
    this.container.appendChild(welcomeDiv);
    this.container.appendChild(buttonSection);
  }

  handleTestClick() {
    alert('Test button clicked!');
  }
}
