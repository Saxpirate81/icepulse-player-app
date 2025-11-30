import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Video, PlayCircle, Save, Image as ImageIcon } from 'lucide-react';

const DrillEditor = ({ drill, onSave, onClose }) => {
  const [title, setTitle] = useState(drill?.title || '');
  const [description, setDescription] = useState(drill?.description || '');
  const [videoType, setVideoType] = useState(drill?.videoUrl ? 'upload' : drill?.videoLink ? 'link' : null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoLink, setVideoLink] = useState(drill?.videoLink || '');
  const [videoPreview, setVideoPreview] = useState(drill?.videoUrl || null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(drill?.imageUrl || null);
  const [imageLink, setImageLink] = useState(drill?.imageLink || '');
  const [targetReps, setTargetReps] = useState(drill?.targetReps || 10);
  const [targetSets, setTargetSets] = useState(drill?.targetSets || 3);
  const [totalSets, setTotalSets] = useState(drill?.totalSets || drill?.targetSets || 3);
  const [defaultTimer, setDefaultTimer] = useState(drill?.defaultTimer || drill?.defaultTimer === 0 ? 0 : null);
  const [difficulty, setDifficulty] = useState(drill?.difficulty || 'intermediate');
  const [autoRepTracking, setAutoRepTracking] = useState(drill?.autoRepTracking !== undefined ? drill.autoRepTracking : false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setVideoType('upload');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSave = () => {
    const drillData = {
      ...drill,
      title,
      description,
      videoUrl: videoPreview,
      videoFile,
      videoLink: videoType === 'link' ? videoLink : null,
      targetReps: parseInt(targetReps),
      targetSets: parseInt(targetSets),
      totalSets: parseInt(totalSets),
      defaultTimer: defaultTimer ? parseInt(defaultTimer) : null,
      difficulty,
      autoRepTracking,
      imageUrl: imagePreview,
      imageFile: imageFile,
      imageLink: imageLink || null,
    };
    onSave(drillData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white uppercase italic">Edit Drill</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Drill Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
              placeholder="Enter drill name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
              rows={3}
              placeholder="Describe the drill..."
            />
          </div>

          {/* Exercise Image Section */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Exercise Image</label>
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex-1 py-2 px-4 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-cyan-500 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ImageIcon size={16} />
                Upload Image
              </button>
              <input
                type="url"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white text-sm focus:border-cyan-500 outline-none"
                placeholder="Or paste image URL"
              />
            </div>
            {imagePreview && (
              <div className="mt-2 rounded-lg overflow-hidden border border-zinc-800">
                <img src={imagePreview} alt="Exercise" className="w-full max-h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Video Section */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Instructional Video</label>
            
            {/* Video Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setVideoType('upload')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  videoType === 'upload'
                    ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <Upload size={16} className="inline mr-2" />
                Upload Video
              </button>
              <button
                onClick={() => setVideoType('link')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  videoType === 'link'
                    ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <LinkIcon size={16} className="inline mr-2" />
                Video Link
              </button>
            </div>

            {/* Upload Option */}
            {videoType === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-zinc-700 rounded-lg hover:border-cyan-500 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Upload size={32} className="text-zinc-500" />
                  <span className="text-zinc-400 text-sm">Click to upload video</span>
                  <span className="text-zinc-500 text-xs">MP4, WebM, or MOV</span>
                </button>
                
                {videoPreview && (
                  <div className="mt-4 relative rounded-lg overflow-hidden border border-zinc-800">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-64"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Link Option */}
            {videoType === 'link' && (
              <div>
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                  placeholder="https://youtube.com/watch?v=... or other video URL"
                />
                {videoLink && (
                  <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center gap-3">
                    <PlayCircle className="text-cyan-400" size={24} />
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold">Video Link Added</p>
                      <p className="text-zinc-400 text-xs truncate">{videoLink}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reps & Sets */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Target Reps</label>
              <input
                type="number"
                value={targetReps}
                onChange={(e) => setTargetReps(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                min="1"
                placeholder="Reps per set"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Target Sets</label>
              <input
                type="number"
                value={targetSets}
                onChange={(e) => setTargetSets(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                min="1"
                placeholder="Sets per exercise"
              />
            </div>
          </div>

          {/* Total Sets */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">
              Total Sets <span className="text-zinc-600">(Required for timed drills)</span>
            </label>
            <input
              type="number"
              value={totalSets}
              onChange={(e) => setTotalSets(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
              min="1"
              placeholder="Total number of sets/repetitions"
            />
            <p className="text-zinc-500 text-xs mt-1">Total number of sets or rounds to complete (for timed drills, specify total sets)</p>
          </div>

          {/* Default Timer */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">
              Default Timer (seconds) <span className="text-zinc-600">(Optional - for timed exercises)</span>
            </label>
            <input
              type="number"
              value={defaultTimer || ''}
              onChange={(e) => setDefaultTimer(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
              min="0"
              placeholder="Leave empty for rep-based exercises"
            />
            <p className="text-zinc-500 text-xs mt-1">Set default timer duration in seconds. Leave empty for rep-based exercises (push-ups, squats, etc.)</p>
          </div>

          {/* Auto Rep Tracking Toggle */}
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <label className="text-sm font-bold text-white uppercase mb-1 block">
                  Auto Rep Tracking
                </label>
                <p className="text-zinc-400 text-xs">
                  Enable AI to automatically count reps/shots during exercise. Works for shooting drills, stick handling, and strength exercises.
                </p>
              </div>
              <div
                onClick={() => setAutoRepTracking(!autoRepTracking)}
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ml-4 ${
                  autoRepTracking ? 'bg-cyan-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    autoRepTracking ? 'translate-x-7' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-800 text-zinc-300 rounded-lg font-bold hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Drill
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrillEditor;

