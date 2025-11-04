import Product from "../model/Product_model.js"


export const Addproduct = async (req, res) => {
    try {
        const { product_name, product_price, product_description, product_stock } = req.body
        const addproduct = new Product({
            product_name,
            product_price,
            product_description,
            product_stock
        })
        await addproduct.save()
        res.status(200).json({ message: "product add successfull", data: addproduct })
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getProduct = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering
        const filter = {};
        if (req.query.minPrice) filter.product_price = { ...filter.product_price, $gte: Number(req.query.minPrice) };
        if (req.query.maxPrice) filter.product_price = { ...filter.product_price, $lte: Number(req.query.maxPrice) };
        if (req.query.search) {
            const regex = new RegExp(req.query.search, "i");
            filter.$or = [
                { product_name: regex },
                { product_description: regex },
            ];
        }



        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            products,
        });
    } catch (error) {
        console.error("Error in getProduct:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};