import cloudinary from "../Middleware/cloudinary.js";
import productsdata from "../Models/Porductsmodels.js";

export const productaddcontroller = async(req , res)=>{
    try {
        const {title ,  price , description , image1 , image2 , image3 , image4 , featuredproduct } = req.body;
        let cloudinaryresponce1 = null;
        if(image1){
            cloudinaryresponce1 = await cloudinary.uploader.upload(image1,{folder:"heritageproducts"});
        }
          let cloudinaryresponce2 = null;
        if(image2){
            cloudinaryresponce2 = await cloudinary.uploader.upload(image2,{folder:"heritageproducts"});
        }
          let cloudinaryresponce3 = null;
        if(image3){
            cloudinaryresponce3 = await cloudinary.uploader.upload(image3,{folder:"heritageproducts"});
        }
          let cloudinaryresponce4 = null;
        if(image4){
            cloudinaryresponce4 = await cloudinary.uploader.upload(image4,{folder:"heritageproducts"});
        };
        const createproduct = await productsdata.create({
            title,
       price: Number(price),
            description,
            featuredproduct,
            image1:cloudinaryresponce1?.secure_url || "",
            image2:cloudinaryresponce2?.secure_url || "",
            image3:cloudinaryresponce3?.secure_url || "",
            image4:cloudinaryresponce4?.secure_url || "",
        });

        res.status(200).json({message :"product send successfully"});
    } catch (error) {
        res.status(500).json({message :"internal error"});
        
    }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await productsdata.find();  
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsdata.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productsdata.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }  
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    await productsdata.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product", error });
  }
};


export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await productsdata.find({ featuredproduct: "true" });
    res.status(200).json(featured);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured products", error });
  }
};

export const getFeaturedProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsdata.findOne({ 
      _id: id,
      featuredproduct: "true" 
    });

    if (!product) {
      return res.status(404).json({ message: "Featured product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductByIdForRecommendation = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productsdata.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductByIdForRecommendation:", error);
    res.status(500).json({ message: "Server error" });
  }
};





