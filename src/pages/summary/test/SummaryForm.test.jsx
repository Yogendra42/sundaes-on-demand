import { render, screen } from "@testing-library/react";
import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";

test("Initialise Conditions", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const Orderbutton = screen.getByRole("button", { name: /confirm order/i });

  expect(checkbox).not.toBeChecked();
  expect(Orderbutton).toBeDisabled();
});

test("Checkbox enables button on first click and disables button on second click", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  await user.click(checkbox);
  const Orderbutton = screen.getByRole("button", { name: /confirm order/i });
  expect(Orderbutton).toBeEnabled();

  await user.click(checkbox);
  expect(Orderbutton).toBeDisabled();
});

test("popover responds to hover", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);

  const nullPopover = screen.queryByText(
    /no ice cream will actuaaly be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  const termsandConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsandConditions);
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  await user.unhover(termsandConditions);
  expect(popover).not.toBeInTheDocument();
});
