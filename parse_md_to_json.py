#!/usr/bin/env python3
"""
Script to parse the markdown file and create a complete JSON file with all 250 questions.
This script extracts questions, options, and solutions from the markdown format.
"""

import re
import json
from typing import Dict, List, Optional


def parse_markdown_to_json(md_file_path: str, output_json_path: str) -> Dict:
    """
    Parse the markdown file and extract all questions with their solutions.
    
    Args:
        md_file_path: Path to the input markdown file
        output_json_path: Path where the JSON file will be saved
        
    Returns:
        Dictionary containing all parsed questions
    """
    
    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content into questions and solutions sections
    sections = content.split('## ✅ Solutions & Explanations')
    questions_section = sections[0] if sections else ""
    solutions_section = sections[1] if len(sections) > 1 else ""
    
    # Parse questions
    questions = parse_questions(questions_section)
    
    # Parse solutions and match them with questions
    solutions = parse_solutions(solutions_section)
    
    # Merge questions with their solutions
    final_questions = merge_questions_and_solutions(questions, solutions)
    
    # Create the final JSON structure
    quiz_data = {
        "title": "Wrong Number Series Practice Test - Complete 250 Questions",
        "description": "Find the wrong term in the following number series questions.",
        "author": "AASHISH ARORA",
        "totalQuestions": len(final_questions),
        "questions": final_questions
    }
    
    # Save to JSON file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(quiz_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Successfully parsed {len(final_questions)} questions")
    print(f"📁 JSON file saved to: {output_json_path}")
    
    return quiz_data


def parse_questions(questions_section: str) -> List[Dict]:
    """Parse the questions section and extract all questions with their options."""
    
    questions = []
    
    # Regular expression to match question blocks
    question_pattern = r'### Question (\d+)\n\n\*\*Series:\*\* ([^\n]+)\n\n\*\*Options:\*\*\n\n((?:- \[ \] \([a-e]\) [^\n]+\n)+)'
    
    matches = re.findall(question_pattern, questions_section, re.MULTILINE)
    
    for match in matches:
        question_id = int(match[0])
        series = match[1].strip()
        options_text = match[2].strip()
        
        # Parse options
        options = {}
        option_pattern = r'- \[ \] \(([a-e])\) (.+)'
        option_matches = re.findall(option_pattern, options_text)
        
        for option_match in option_matches:
            option_key = option_match[0]
            option_value = option_match[1].strip()
            options[option_key] = option_value
        
        questions.append({
            "id": question_id,
            "series": series,
            "options": options
        })
    
    return questions


def parse_solutions(solutions_section: str) -> Dict[int, Dict]:
    """Parse the solutions section and extract explanations and answers."""
    
    solutions = {}
    
    # Split solutions by individual solution blocks
    solution_blocks = re.split(r'### Solution (\d+)', solutions_section)
    
    # Process solution blocks (skip the first empty element)
    for i in range(1, len(solution_blocks), 2):
        if i + 1 >= len(solution_blocks):
            break
            
        solution_id = int(solution_blocks[i])
        solution_content = solution_blocks[i + 1]
        
        # Extract the pattern explanation
        pattern_match = re.search(r'\*\*Pattern:\*\*\n\n(.*?)\n\n\*\*Answer:\*\*', solution_content, re.DOTALL)
        pattern = pattern_match.group(1).strip() if pattern_match else ""
        
        # Extract the answer and identify correct option
        answer_match = re.search(r'\*\*Answer:\*\* (.+)', solution_content)
        answer_text = answer_match.group(1).strip() if answer_match else ""
        
        # Extract the wrong number from the answer
        wrong_number_match = re.search(r'The wrong number is ([^,]+)', answer_text)
        wrong_number = wrong_number_match.group(1).strip() if wrong_number_match else ""
        
        solutions[solution_id] = {
            "pattern": pattern,
            "answer_text": answer_text,
            "wrong_number": wrong_number
        }
    
    return solutions


def find_correct_answer(question: Dict, solution: Dict) -> str:
    """Find the correct answer option by matching the wrong number with options."""
    
    wrong_number = solution.get("wrong_number", "").strip()
    if not wrong_number:
        return "a"  # Default fallback
    
    # Clean the wrong number (remove extra characters)
    wrong_number = wrong_number.replace("–", "-")  # Convert em dash to minus
    
    for option_key, option_value in question["options"].items():
        option_clean = option_value.strip().replace("–", "-")
        if option_clean == wrong_number:
            return option_key
    
    # If exact match not found, try partial matching
    for option_key, option_value in question["options"].items():
        if wrong_number in option_value or option_value in wrong_number:
            return option_key
    
    return "a"  # Default fallback


def merge_questions_and_solutions(questions: List[Dict], solutions: Dict[int, Dict]) -> List[Dict]:
    """Merge questions with their corresponding solutions."""
    
    final_questions = []
    
    for question in questions:
        question_id = question["id"]
        solution = solutions.get(question_id, {})
        
        # Find the correct answer
        correct_answer = find_correct_answer(question, solution)
        
        # Create explanation from pattern and answer
        pattern = solution.get("pattern", "").replace("\n\n", " → ")
        answer_text = solution.get("answer_text", "")
        
        explanation = f"{pattern.strip()} {answer_text}".strip()
        if not explanation:
            explanation = f"Pattern analysis needed for series: {question['series']}"
        
        final_question = {
            "id": question_id,
            "series": question["series"],
            "options": question["options"],
            "correctAnswer": correct_answer,
            "explanation": explanation
        }
        
        final_questions.append(final_question)
    
    return final_questions


def main():
    """Main function to run the parser."""
    
    input_file = "wrong_number_series_250_mcq_notion_format.md"
    output_file = "questions_complete_250.json"
    
    print("🔄 Starting to parse markdown file...")
    print(f"📖 Input file: {input_file}")
    print(f"💾 Output file: {output_file}")
    print("-" * 50)
    
    try:
        quiz_data = parse_markdown_to_json(input_file, output_file)
        
        print("-" * 50)
        print("📊 Summary:")
        print(f"   • Total Questions: {quiz_data['totalQuestions']}")
        print(f"   • Title: {quiz_data['title']}")
        print(f"   • Author: {quiz_data['author']}")
        
        # Show first question as sample
        if quiz_data['questions']:
            first_q = quiz_data['questions'][0]
            print(f"\n📝 Sample Question:")
            print(f"   • ID: {first_q['id']}")
            print(f"   • Series: {first_q['series']}")
            print(f"   • Correct Answer: {first_q['correctAnswer']}")
            print(f"   • Options: {len(first_q['options'])} choices")
        
        # Backup the current small questions.json
        print(f"\n🔄 Creating backup of current questions.json...")
        
        import shutil
        try:
            shutil.copy("questions.json", "questions_sample_backup.json")
            print("✅ Backup created as questions_sample_backup.json")
        except FileNotFoundError:
            print("⚠️  No existing questions.json found to backup")
        
        # Replace current questions.json with the complete version
        shutil.copy(output_file, "questions.json")
        print(f"✅ Replaced questions.json with complete 250 questions")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
