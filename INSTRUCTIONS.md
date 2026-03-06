```
      ╔═════════════════════════════════════════════════════════════╗
      ║                      _____ _                                ║
      ║                     |_   _| |__   ___                       ║
      ║                       | | | '_ \ / _ \                      ║
      ║                       | | | | | |  __/                      ║
      ║                   _   |_| |_| |_|\___|  __ _          _     ║
      ║   _ __ ___   ___ | |__ (_) | ___       / _(_)_ __ ___| |_   ║
      ║  | '_ ` _ \ / _ \| '_ \| | |/ _ \ ___ | |_| | '__/ __| __|  ║
      ║  | | | | | | (_) | |_) | | |  __/|___||  _| | |  \__ \ |_   ║
      ║  |_| |_| |_|\___/|_.__/|_|_|\___|     |_| |_|_|  |___/\__|  ║
      ║          ___ ___  _ __ ___  _ __   __ _ _ __  _   _         ║
      ║         / __/ _ \| '_ ` _ \| '_ \ / _` | '_ \| | | |        ║
      ║        | (_| (_) | | | | | | |_) | (_| | | | | |_| |        ║
      ║         \___\___/|_| |_| |_| .__/ \__,_|_| |_|\__, |        ║
      ║                            |_|                |___/         ║
      ║                                                             ║
      ╚═════════════════════════════════════════════════════════════╝
```
# React Native Technical Test

# Part 1: Chat Input Redesign Challenge

## Requirements

Your goal is to redesign the chat input component in `app/index.tsx` to create a delightful and intuitive user experience. The current implementation has a basic input field and send button, but we want you to elevate it to match the polish and behavior of industry-leading chat applications.

### Design Reference

**Figma Design**: https://www.figma.com/design/sKoVdC8r9K0fCpe4oKI4au/Chat-Technical-Test?node-id=0-1&t=4CvumWtfXRS5tKvU-1

The Figma design provides the visual specifications for the new input design. You should follow the design closely while ensuring the implementation feels natural and responsive.

### Behavioral Reference

**Slack Input Behavior**: Study and replicate the input behavior from the Slack application. Pay close attention to:

- **Dynamic Height**: The input should grow smoothly as users type multiple lines
- **Keyboard Interactions**: Smooth transitions when the keyboard appears/disappears
- **Send Button States**: The send button should change state based on input content
- **Animations**: Subtle, polished animations that enhance the experience without being distracting

### Core Features

1. **Visual Design**
   - Follow the Figma design specifications precisely
   - Ensure pixel-perfect implementation of spacing, colors, typography, and borders
   - Maintain consistency with the overall app design language

2. **User Experience**
   - Replicate the intuitive behavior of Slack's input
   - Smooth animations and transitions throughout
   - Responsive feedback for all user interactions
   - Handle edge cases gracefully (empty input, long text, keyboard states, etc.)

### What We're Looking For

- **Attention to Detail**: Pixel-perfect implementation of the Figma design
- **User-Centric Thinking**: Understanding of what makes an input experience delightful
- **Technical Excellence**: Clean, maintainable code with proper state management
- **Polish**: Smooth animations, proper edge case handling, and professional finish

### Current Implementation

The current input is located in `app/index.tsx` and consists of:
- A basic `TextInput` component
- A simple send button
- Basic keyboard avoidance

Your task is to transform this into a polished, production-ready input component that rivals the best chat applications in the industry.

# Part 2: Product Strategy & Design Challenge

## The Challenge: Design the Next Evolution of Your Chat

After completing the chat input redesign, you now have a polished chat interface with a delightful input experience. But how can you make the entire chat experience more valuable and engaging for users?

**Your Mission**: Analyze the current chat implementation and design 2-3 strategic enhancements that would significantly improve user value and engagement. Focus on **why** these improvements matter, not just **what** to build.

## What We're Looking For

1. **Problem Analysis**: What specific user pain points or business opportunities did you identify? Why are these important?
2. **Strategic Thinking**: How did you prioritize which improvements to focus on? What trade-offs did you consider?
3. **Solution Design**: What would your ideal solution look like? How would users interact with it?
4. **Technical Feasibility**: What are the technical challenges and implementation considerations?
5. **Business Impact**: How would these improvements drive user engagement, retention, or other business metrics?

## Your Deliverable

**Write a comprehensive analysis** that covers:

- **Current State Assessment**: What works well in your Part 1 implementation? What are the limitations?
- **Opportunity Identification**: What 2-3 specific improvements would you prioritize and why?
- **Solution Design**: Describe your proposed enhancements in detail - user flows, UI concepts, technical approach
- **Justification**: Why these specific improvements over others? What evidence or reasoning supports your choices?
- **Implementation Roadmap**: How would you approach building these features? What are the technical challenges?

## Optional: Proof of Concept

If you want to demonstrate your ideas, you can implement a simple prototype of one feature.

## Evaluation Criteria

### Part 1: Chat Input Redesign
- **Design Fidelity**: Accuracy in implementing the Figma design specifications
- **Behavioral Accuracy**: Faithful replication of Slack iOS input behavior
- **Technical Depth**: Understanding of React Native, mobile development patterns, and best practices
- **Code Quality**: Well-structured, maintainable code with proper state management
- **Polish**: Smooth animations, proper edge case handling, and professional finish

### Part 2: Product Strategy
- **Problem-Solving**: Clear thinking process and well-reasoned solutions
- **Strategic Thinking**: Ability to identify and prioritize valuable improvements
- **User-Centric Approach**: Understanding of user needs and business impact

# Getting Started

1. Fork this repository on your own GitHub account
2. Study the Figma design and Slack iOS input behavior
3. Redesign the chat input in `app/index.tsx` following the design and behavioral requirements
4. Complete the product strategy challenge (Part 2)
5. Document your approach and decisions
6. Send us the URL to your forked repository with clear instructions for running the app

Good luck! We're excited to see your solution and thought process.
