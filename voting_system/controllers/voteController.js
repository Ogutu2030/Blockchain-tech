const Vote = require('../models/Vote');
const Election = require('../models/Election');
const User = require('../models/User');

exports.castVote = async (req, res) => {
    try {
        const { electionId, candidateId } = req.body;
        const userId = req.user.id;

        // Check if election is active
        const election = await Election.findById(electionId);
        if (!election || election.status !== 'active') {
            return res.status(400).json({ 
                success: false, 
                message: 'Election is not active or does not exist' 
            });
        }

        // Check if user has already voted in this election
        const existingVote = await Vote.findByUserAndElection(userId, electionId);
        if (existingVote) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already voted in this election' 
            });
        }

        // Record the vote
        await Vote.create({
            user_id: userId,
            election_id: electionId,
            candidate_id: candidateId,
            ip_address: req.ip
        });

        res.status(200).json({ 
            success: true, 
            message: 'Vote cast successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getResults = async (req, res) => {
    try {
        const { electionId } = req.params;
        
        // Verify election exists
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ 
                success: false, 
                message: 'Election not found' 
            });
        }

        // Only show results if election is completed
        if (election.status !== 'completed' && !req.user.isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Results are not yet available' 
            });
        }

        // Get election results
        const results = await Vote.getResultsByElection(electionId);

        res.status(200).json({ 
            success: true, 
            results,
            election
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};