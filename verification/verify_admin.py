from playwright.sync_api import sync_playwright

def verify_admin():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            print("Navigating to frontend...")
            page.goto("http://localhost:5173", timeout=10000)

            print("Checking admin link visibility (should be hidden for guest)...")
            admin_link = page.query_selector('text=Admin Panel')
            if admin_link:
                print("FAILURE: Admin link visible to guest")
            else:
                print("SUCCESS: Admin link hidden")

            print("Trying to access /admin directly...")
            page.goto("http://localhost:5173/admin")
            page.wait_for_timeout(2000)

            if "Access Denied" in page.content():
                print("SUCCESS: Admin route protected")
            else:
                print("FAILURE: Admin route accessible")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_admin()
