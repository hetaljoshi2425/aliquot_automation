
---

**Test Case:** Service Report Draft Creation with Idle Pause for 30 mins.

**Scenario:**

1. **Login** as a valid user.
2. **Select a System** from the available list.
3. **Create a Service Report** for the selected system.
4. **Enter initial test results** (2-3 inputs).
5. **Pause the automation** (keep the session idle) for 30–35 minutes.
6. **Enter additional test results** after the idle period.
7. **Save the report as a Draft**.
8. **Verify** that the Draft is successfully saved and appears in the report list.

---

Steps to Run the script.

1. Clone the repo.
2. Run the below command in the terminal.

npx playwright test tests/regression/smoke/new_report.spec.ts --headed



