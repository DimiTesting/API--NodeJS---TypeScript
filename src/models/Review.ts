import mongoose, {Model, Schema, Document} from "mongoose";

interface IReview extends Document {
    title: string;
    text: string;
    rating: number;
    user: mongoose.Types.ObjectId;
    bootcamp: mongoose.Types.ObjectId;
}


interface IReviewModel extends Model<IReview> {
    getAverageRating(bootcampId: mongoose.Types.ObjectId): Promise<void>;
}


const ReviewSchema = new mongoose.Schema<IReview>({
    title: {
        type: String, 
        trim: true,
        required: [true, 'Please add a review title'],
        maxlength: 100
    }, 
    text: {
        type: String, 
        required: [true, 'Please add a text']
    },
    rating: {
        type: Number, 
        min: 1,
        max: 10, 
        required: [true, 'Please add a rating between 1 and 10']
    }, 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

ReviewSchema.statics.getAverageRating = async function(bootcampId : mongoose.Types.ObjectId) {
    
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {$avg: '$rating'}
            }
        }        
    ]);

    console.log(obj)

    try {
        await mongoose.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj.length > 0 ? Math.ceil(obj[0].averageRating) : 0
        });
    } catch (error) {
        console.error('Error updating bootcamp average cost:', error);
    }
}

ReviewSchema.post('save', function() {
    (this.constructor as IReviewModel).getAverageRating(this.bootcamp);
});

ReviewSchema.pre('deleteOne', {document: true}, function() {
    (this.constructor as IReviewModel).getAverageRating(this.bootcamp);
});


export default mongoose.model('Review', ReviewSchema);