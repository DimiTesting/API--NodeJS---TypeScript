import mongoose, {Model, Schema, Document} from "mongoose";

interface ICourse extends Document {
    title: string;
    description: string;
    weeks: string;
    tuition: number;
    minimumSkill: 'beginner' | 'intermediate' | 'advance';
    scholarshipAvailable: boolean;
    createdAt: Date;
    bootcamp: mongoose.Types.ObjectId;
}

interface ICourseModel extends Model<ICourse> {
    getAverageCost(bootcampId: mongoose.Types.ObjectId): Promise<void>;
}

const CourseSchema = new mongoose.Schema<ICourse>({
    title: {
        type: String, 
        trim: true,
        required: [true, 'Please add a course title']
    }, 
    description: {
        type: String, 
        required: [true, 'Please add a description']
    }, 
    weeks: {
        type: String, 
        required: [true, 'Please add number of weeks']        
    }, 
    tuition: {
        type: Number, 
        required: [true, 'Please add a tution cost']        
    },     
    minimumSkill: {
        type: String, 
        required: [true, 'Please add a minumum skill'],
        enum: ['beginner', 'intermediate', 'advance']        
    },    
    scholarshipAvailable: {
        type: Boolean, 
        default: false
    }, 
    createdAt: {
        type: Date, 
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

CourseSchema.statics.getAverageCost = async function(bootcampId : mongoose.Types.ObjectId) {
    console.log('Calculating average cost');

    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {$avg: '$tuition'}
            }
        }        
    ]);

    console.log(obj)

    try {
        await mongoose.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: obj.length > 0 ? Math.ceil(obj[0].averageCost) : 0
        });
    } catch (error) {
        console.error('Error updating bootcamp average cost:', error);
    }
}

CourseSchema.post('save', function() {
    (this.constructor as ICourseModel).getAverageCost(this.bootcamp);
});

CourseSchema.pre('deleteOne', {document: true}, function() {
    (this.constructor as ICourseModel).getAverageCost(this.bootcamp);
});

export default mongoose.model('Course', CourseSchema);