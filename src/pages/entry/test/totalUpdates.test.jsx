import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("updates scoop subtotal when scoop change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  const scoopsSubtotal = screen.getByText("Scoops total:$", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  const vanillInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillInput);
  await user.type(vanillInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("updates topping subtotal when topping selected", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  const toppingsSubtotal = screen.getByText("Toppings total:$", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  const CherriesCheckBox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  expect(CherriesCheckBox).not.toBeChecked();
  await user.click(CherriesCheckBox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  const MandMsCheckBox = screen.getByRole("checkbox", { name: "M&Ms" });
  expect(MandMsCheckBox).not.toBeChecked();

  await user.click(MandMsCheckBox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");
  expect(MandMsCheckBox).toBeChecked();

  await user.click(MandMsCheckBox);
  expect(MandMsCheckBox).not.toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at $0.00", () => {
    // Test that the total start out at $0.00
    const { unmount } = render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("0.00");

    unmount();
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });

    const VanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(VanillaInput);
    await user.type(VanillaInput, "2");

    expect(grandTotal).toHaveTextContent("4.00");

    const CherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(CherriesCheckbox);

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });

    const CherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(CherriesCheckbox);

    expect(grandTotal).toHaveTextContent("1.50");

    const VanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(VanillaInput);
    await user.type(VanillaInput, "2");

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });

    const CherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(CherriesCheckbox);

    const VanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(VanillaInput);
    await user.type(VanillaInput, "2");

    await user.clear(VanillaInput);
    await user.type(VanillaInput, "1");

    expect(grandTotal).toHaveTextContent("3.50");

    await user.click(CherriesCheckbox);

    expect(grandTotal).toHaveTextContent("2.00");
  });
});
