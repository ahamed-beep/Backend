import cloudinary from "../Middleware/cloudinary.js";
import submissions from "../Models/Submissionformmodel.js";

export const submissionfromdata = async (req, res) => {
  try {
    const {
      name,
      location,
      phone,
      phone2,
      email,
      socialmedia,
      guadianowner,
      attachment,
      otherspecify,
      image,
      dateimage,
      placeimage,
      photographcaptain,
      story,
      narrative,
      imageadded,
      imagebefore,
      termsandcondition,
      category,
      title,
        status,
        admindescription,
           featuredphotograph,
            featuredletter

    } = req.body;

    const existing = await submissions.findOne({
      email,
      title,
      story,
    });

    if (existing) {
      return res.status(400).json({
        message: "Duplicate submission detected. This letter has already been submitted.",
      });
    }

    let cloudinaryresponce = null;
    if (image) {
      cloudinaryresponce = await cloudinary.uploader.upload(image, {
        folder: "submissions",
      });
    }

    const createsubmissions = await submissions.create({
      name,
      location,
      phone,
      phone2,
      email,
      socialmedia,
      guadianowner,
      attachment,
      otherspecify,
      image: cloudinaryresponce?.secure_url || "",
      dateimage,
      placeimage,
      photographcaptain,
      story,
      narrative,
      imageadded,
      imagebefore,
      termsandcondition,
      category,
      title,
      status,
      admindescription,
      featuredphotograph,
      featuredletter
    });

 res.status(200).json({ message: "Submission submitted successfully", createsubmissions });
  } catch (error) {
    console.error("Submission Error:", error);
res.status(500).json({ message: "Submission failed", error: error.message });
  }
};


export const getsubmissionsdata = async (req, res) => {
  try {
    const getdata = await submissions.find();
    if(!getdata || getdata.length === 0){
      return res.status(400).json({message: "Data not found"});
    }
    res.status(200).json({message: "Data fetched successfully", data: getdata}); // <- returning data
  } catch (error) {
    res.status(500).json({message: "Internal error"});
  }
};


export const getsinglesubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const findata = await submissions.findById(id);

    if (!findata) {
      return res.status(400).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Data get successfully",
      findata, // <-- yeh actual data bhejo
    });

  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};

export const updatesubmission = async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedData = req.body; 

    const updatedSubmission = await submissions.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({
      message: "Submission updated successfully",
      updatedSubmission,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const getLetterSubmissions = async (req, res) => {
  try {
    const data = await submissions.find({ attachment: "Letter" });
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No Letter submissions found" });
    }
    res.status(200).json({ message: "Letter submissions fetched", data });
  } catch (error) {
    console.error("Letter Submissions Error:", error);
    res.status(500).json({ message: "Internal error", error: error.message });
  }
};

export const getPhotographSubmissions = async (req, res) => {
  try {
    const data = await submissions.find({ attachment: "Photograph" });
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No Photograph submissions found" });
    }
    res.status(200).json({ message: "Photograph submissions fetched", data });
  } catch (error) {
    console.error("Photograph Submissions Error:", error);
    res.status(500).json({ message: "Internal error", error: error.message });
  }
};

