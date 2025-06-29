const Content = require('../models/Content');

exports.getAll = async (req, res) => {
  const content = await Content.find().sort({ date: 1 });
  res.json(content);
};

exports.create = async (req, res) => {
  const item = new Content(req.body);
  await item.save();
  res.status(201).json(item);
};

exports.update = async (req, res) => {
  const updated = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
