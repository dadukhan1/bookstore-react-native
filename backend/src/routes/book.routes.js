import express from 'express';
import Book from '../models/book.model.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const route = express.Router();

route.post("/", protectRoute, async (req, res) => {
    try {

        const { title, caption, rating, user, image } = req.body;
        if (!title || !caption || !rating || !user || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //uploading to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = await new Book.create({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })

        await newBook.save();

        res.status(201).json({ newBook })




    } catch (error) {
        console.log("Error in creating book", error);
        res.status(500).json({ message: error.message });
    }
})

route.get("/", protectRoute, async (req, res) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage")
            .exec();

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });


    } catch (error) {
        console.log("Error in getting books route", error);
        res.status(500).json({ message: error.message });
    }
})

route.get("/user", protectRoute, async (req, res) => {  
    try{
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 }).exec();
        res.json({ books });
    }catch(error){
        console.error("Error in getting user books", error);
        res.status(500).json({ message: error.message });
    }
})

route.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) 
            return res.status(404).json({ message: "Book not found" });

        if(book.user.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "You are not authorized to delete this book" });

        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.error("Error deleting image from Cloudinary:", deleteError);
                return res.status(500).json({ message: "Error deleting image from Cloudinary" });
            }
        }

        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        
    }
})

export default route;