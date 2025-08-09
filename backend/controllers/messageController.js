import conversion from "../model/conversation.js";
import messageModel from "../model/messages.js";
import { getReceverSocketId, io } from "../socket/socket.js";
import schedule from 'node-schedule';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { messages, time, repliedMessage, repliedUserId } = req.body;

        let conversation = await conversion.findOne({
            participent: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await conversion.create({
                participent: [senderId, receiverId]
            });
        }

        const createAndSendMessage = async () => {
            const newMessage = await messageModel.create({
                senderId,
                receiverId,
                messages,
                repliedMessage,
                repliedUserId
            });

            conversation.messages.push(newMessage._id);

            await Promise.all([conversation.save(), newMessage.save()]);

            const receiverSocketId = getReceverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            return newMessage;
        };

        if (time) {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            const now = new Date();
            const scheduledTime = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes,
                seconds || 0
            );

            if (scheduledTime > now) {
                console.log(`Scheduling message for: ${scheduledTime}`);

                schedule.scheduleJob(scheduledTime, async () => {
                    try {
                        const newMessage = await createAndSendMessage();
                        console.log(`Message sent at: ${scheduledTime}`);
                        return res.json({ success: true, newMessage, message: 'Message scheduled successfully' });
                    } catch (error) {
                        console.log('Error in scheduled message:', error.message);
                    }
                });

            } else {
                return res.status(400).json({ success: false, message: 'Scheduled time is in the past.' });
            }
        } else {
            const newMessage = await createAndSendMessage();
            return res.json({ success: true, newMessage });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await conversion
            .findOne({
                participent: { $all: [senderId, receiverId] },
            })
            .populate({
                path: 'messages',
            });


        if (!conversation) return res.json({ success: true, messages: [] });

        return res.json({ success: true, messages: conversation.messages });
    } catch (error) {
        console.log(error);

    }
}

export const unSendMessage = async (req, res) => {
    try {
        const messageId = req.params.msgId;
        const receiverId = req.params.id;
        const senderId = req.id;

        if (!senderId) return res.json({ success: false, message: 'User Not Authenticated' });
        if (!messageId) return res.json({ success: false, message: 'No Message ID' });

        // Delete the message
        const messages = await messageModel.findByIdAndDelete(messageId);

        // Message is delete in real time 
        const receiverSocketId = getReceverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('unSendMessage', messages);
        }

        // Update the conversation to remove the message ID
        await conversion.updateOne(
            { participent: { $all: [senderId, receiverId] } },
            { $pull: { messages: messageId } }
        );

        return res.json({ success: true, messages, message: 'Message Unsend Successful' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};