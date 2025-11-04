import Order from "../model/Order.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getallorder = async (req, res) =>{
    try{
        const getorder = await Order.find()
        res.status(200).json({message:"Fetch", data:getorder})
    }catch(err){
        res.status(500).json({message: "Internal server error"})
    }
}