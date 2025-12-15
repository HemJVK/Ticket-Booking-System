from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to frontend...")
            page.goto("http://localhost:5173", timeout=10000)

            # Wait for content
            page.wait_for_selector('h2:has-text("Trending Now")')

            # Check color
            element = page.locator('h2:has-text("Trending Now")')
            color = element.evaluate("el => getComputedStyle(el).color")
            print(f"Computed color: {color}")

            if color == 'rgb(255, 255, 255)':
                print("SUCCESS: Text is white")
            else:
                print(f"FAILURE: Text is {color}")

            # Take screenshot
            page.screenshot(path="verification/ui_fixed.png")
            print("Screenshot saved to verification/ui_fixed.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ui()
