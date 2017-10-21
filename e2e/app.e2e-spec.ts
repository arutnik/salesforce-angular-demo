import { SalesforceAngularDemoPage } from './app.po';

describe('salesforce-angular-demo App', () => {
  let page: SalesforceAngularDemoPage;

  beforeEach(() => {
    page = new SalesforceAngularDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
