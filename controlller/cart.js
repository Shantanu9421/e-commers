import Cart from "../model/cart.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: quantity || 1 }]
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.items.push({ productId, quantity: quantity || 1 });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getCart = async (req, res) => {
  try {
    const userId  = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error in deleteCartItem:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};