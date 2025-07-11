import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper to connect to the database and get the collection
async function getCollection() {
    const client = await clientPromise;
    const db = client.db('CoudMongo'); // Using the same database
    return db.collection('cryptoNotes'); // A new collection for crypto notes
}

export async function GET() {
    try {
        const collection = await getCollection();
        const cryptoNotes = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(cryptoNotes);
    } catch (error) {
        console.error('Error fetching crypto notes:', error);
        return NextResponse.json({ message: 'Error fetching crypto notes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const collection = await getCollection();
        
        // If an _id is present, it's an update.
        // If not, it's an insert.
        if (body._id) {
            const { _id, ...noteData } = body;
            const result = await collection.updateOne(
                { _id: new ObjectId(_id) },
                { $set: noteData },
                { upsert: true }
            );
            return NextResponse.json({ message: 'Crypto note updated', data: result }, { status: 200 });
        } else {
            const result = await collection.insertOne(body);
            return NextResponse.json({ message: 'Crypto note saved', data: result.insertedId }, { status: 201 });
        }
    } catch (error) {
        console.error('Error saving crypto note:', error);
        return NextResponse.json({ message: 'Error saving crypto note' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid Note ID' }, { status: 400 });
        }

        const collection = await getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Crypto note deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting crypto note:', error);
        return NextResponse.json({ message: 'Error deleting crypto note' }, { status: 500 });
    }
}
