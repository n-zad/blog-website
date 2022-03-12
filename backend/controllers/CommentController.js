const CommentHandler = require('../models/CommentHandler');
const catchAsync = require('../utils/catchAsync');

// GET /comment/
exports.getAllComments = catchAsync(async (req, res) => {
	const allComments = await CommentHandler.getAllComments();

    res.status(200).json({
	  status: 'success',
	  data: allComments
	});
});

// POST /comment/
exports.createComment = catchAsync(async (req, res) => {
    const result = await CommentHandler.createComment(req.body);

    if (!result) {
        res.status(404).json({
            status: 'failed to add comment',
            data: req.body
        });
    } else {
        res.status(200).json({
            status: 'success, added comment',
            data: result
        });
    }
});

// GET /comment/{id}
exports.getCommentById = catchAsync(async (req, res) => {
    const comment = await CommentHandler.getCommentById(req.params.id);
  
	res.status(200).json({
        status: 'success',
        data: { comment }
	});
});

// UPDATE /comment/{id}
exports.updateCommentById = catchAsync(async (req, res) => {
    const comment = await CommentHandler.updateCommentById(req.params.id, req.body);
  
	res.status(200).json({
	    status: 'success',
	    data: { comment }
	});
});

// DELETE /comment/{id}
exports.deleteCommentById = catchAsync(async (req, res) => {
    const result = CommentHandler.deleteCommentById(req.params.id);

    if(result)
        res.status(200).send(req.params.id).end();
});
