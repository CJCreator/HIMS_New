# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "Welcome to AroCord" [level=1] [ref=e6]
    - paragraph [ref=e7]: Sign in to your account
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]: Email
      - textbox "Enter your email" [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]: Password
      - textbox "Enter your password" [ref=e14]
    - generic [ref=e15]:
      - generic [ref=e16]: Role
      - combobox [ref=e17]:
        - option "Admin" [selected]
        - option "Doctor"
        - option "Receptionist"
        - option "Nurse"
        - option "Pharmacist"
    - button "Sign In" [disabled] [ref=e18]
  - link "Forgot your password?" [ref=e20] [cursor=pointer]:
    - /url: "#"
```