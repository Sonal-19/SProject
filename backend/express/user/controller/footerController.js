const Footer = require("../model/footerModel");
const ContactUs = require("../model/contactUsModel");
const token = require("../../middleware/token");

const footerController = {
  addCustomerPolicy: async (req, res) => {
    try {
      // console.log("req.body", req.body);
      const { description,type } = req.body;
      let payload=req.body
      // console.log('payload', payload)
        const existingPolicy = await Footer.findOne({type:type});
        // console.log('description', description)
        if (existingPolicy) {
 
        const existingPolicy = await Footer.findByIdAndUpdate({_id:existingPolicy._id},payload);

          res.status(200).json({ message: 'Privacy Policy Updated' });
        } else {
          const newPrivacyPolicy = new Footer( payload );
          await newPrivacyPolicy.save();
          res.status(201).json({ message: 'Privacy Policy Saved' });
        }
      } catch (error) {
        console.error('Error saving policy', error);
        res.status(500).json({ message: 'Error saving policy' });
      }
    },

    getCustomerPolicy: async(req, res)=>{
      try{
          let {type}=req.query

          const policy = await Footer.findOne({type:type});
          // console.log("policy",policy);
          if(policy){
              res.status(200).json({content: policy});
          }else{
              res.status(404).json({message: 'Privacy policy not found'});
          }
      }catch(error){
          console.error("Error getting provacy policy",error);
          res.status(500).json({message:"Error getting privacy policy"});
      }
    },

  // getPrivacyPolicy: async (req, res) => {
  //   try {
  //     const footer = await Footer.findOne();
  //     res.json({ content: footer ? footer.privacyPolicy.content : '' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  // addToTermsAndConditions: async (req, res) => {
  //   const { content } = req.body;
  //   try {
  //     let footer = await Footer.findOne();
  //     if (!footer) {
  //       footer = new Footer({ termsAndConditions: { content } });
  //       await footer.save();
  //     } else {
  //       footer.termsAndConditions.content = content;
  //       await footer.save();
  //     }
  //     res.json({ success: true });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  // getTermsAndConditions: async (req, res) => {
  //   try {
  //     const footer = await Footer.findOne();
  //     res.json({ content: footer ? footer.termsAndConditions.content : '' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  // addToTermsOfUse: async (req, res) => {
  //   const { content } = req.body;
  //   try {
  //     let footer = await Footer.findOne();
  //     if (!footer) {
  //       footer = new Footer({ termsOfUse: { content } });
  //       await footer.save();
  //     } else {
  //       footer.termsOfUse.content = content;
  //       await footer.save();
  //     }
  //     res.json({ success: true });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  // getTermsOfUse: async (req, res) => {
  //   try {
  //     const footer = await Footer.findOne();
  //     res.json({ content: footer ? footer.termsOfUse.content : '' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  // addToAccessibility: async (req, res) => {
  //   const { content } = req.body;
  //   try {
  //     let footer = await Footer.findOne();
  //     if (!footer) {
  //       footer = new Footer({ accessibility: { content } });
  //       await footer.save();
  //     } else {
  //       footer.accessibility.content = content;
  //       await footer.save();
  //     }
  //     res.json({ success: true });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  // getAccessibility: async (req, res) => {
  //   try {
  //     const footer = await Footer.findOne();
  //     res.json({ content: footer ? footer.accessibility.content : '' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },

  contactUs: async (req, res) => {
    const { name, email, message } = req.body;
    try {
      let userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing in the request.");
      }
      const newContactUs = new ContactUs({
        name,
        email,
        message,
      });
      await newContactUs.save();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = footerController;