# 🧮 Wrong Number Series Practice Test

A simple, clean web application for practicing "Wrong Number Series" questions. Users can test their pattern recognition skills by identifying the incorrect number in various mathematical sequences.

## ✨ Features

- **Single Screen Interface**: Clean, minimal design focused on the test experience
- **Sequential Questions**: Questions appear one by one for focused practice
- **Instant Feedback**: Immediate indication of correct/incorrect answers
- **Detailed Explanations**: Each question includes an explanation of the pattern
- **Progress Tracking**: Visual progress bar and real-time score display
- **Final Score**: Comprehensive results with performance feedback
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Keyboard Support**: Use number keys (1-5) to select answers and Enter to proceed

## 🚀 Live Demo

Simply open `index.html` in your web browser to start the practice test.

## 📁 Project Structure

```
wrong-number-series-test/
├── index.html          # Main HTML file
├── styles.css          # CSS styles for the application
├── script.js           # JavaScript logic for the quiz
├── questions.json      # Question data stored in JSON format
└── README.md          # Project documentation
```

## 🎯 How to Use

1. **Clone or Download** this repository
2. **Open** `index.html` in any modern web browser
3. **Start the Test** - questions will appear one by one
4. **Select an Answer** by clicking on the options (a-e)
5. **View Feedback** - see if you're correct and read the explanation
6. **Continue** through all questions
7. **View Results** - see your final score and performance feedback
8. **Restart** anytime to practice again

## 🔧 Customization

### Adding More Questions

Edit the `questions.json` file to add more questions. Each question should follow this structure:

```json
{
  "id": 1,
  "series": "1, 2, 3, 5, 8, 13, 21",
  "options": {
    "a": "1",
    "b": "3",
    "c": "5",
    "d": "8",
    "e": "13"
  },
  "correctAnswer": "b",
  "explanation": "This is the Fibonacci sequence. The wrong number is 3, which should be 4."
}
```

### Modifying Styles

Edit `styles.css` to change:

- Colors and themes
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

### Enhancing Functionality

Modify `script.js` to add features like:

- Timer functionality
- Different difficulty levels
- Question categories
- Local storage for progress saving

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Gradient Background**: Beautiful gradient backdrop
- **Interactive Elements**: Hover effects and smooth transitions
- **Visual Feedback**: Color-coded correct/incorrect indicators
- **Progress Visualization**: Dynamic progress bar
- **Responsive Layout**: Adapts to any screen size

## 🔧 Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Modern Browser Support**: Works on all modern browsers
- **Lightweight**: Fast loading with optimized assets
- **Accessible**: Keyboard navigation support
- **Mobile-First**: Responsive design for all devices

## 📊 Question Types

The current dataset includes various types of number series patterns:

- Arithmetic progressions
- Geometric progressions
- Fibonacci-like sequences
- Mixed operation patterns
- Complex mathematical relationships

## 🤝 Contributing

Feel free to contribute by:

- Adding more questions to `questions.json`
- Improving the UI/UX design
- Adding new features
- Fixing bugs or issues
- Enhancing documentation

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 🙏 Credits

Questions curated by **AASHISH ARORA**  
Web application developed for educational purposes.

---

**Happy Learning! 🎓**

Start practicing your number series pattern recognition skills and improve your mathematical reasoning abilities!
