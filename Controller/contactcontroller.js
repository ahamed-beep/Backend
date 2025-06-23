import contact from "../Models/contactmodel.js";

export const contactsubmitcontroller = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const existingContact = await contact.findOne({ email });

    if (existingContact) {
      return res.status(400).json({ message: "You have already submitted a message with this email." });
    }

    await contact.create({ name, email, message });

    res.status(200).json({ message: "Your message has been submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};


export const getcontactdatacontroller = async (req, res) => {
  try {
    const getsubmission = await contact.find();
    if (!getsubmission || getsubmission.length === 0) {
      return res.status(404).json({ message: "data not found", getsubmission: [] });
    }
    res.status(200).json({
      message: "data get successfully",
      getsubmission
    });
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};
