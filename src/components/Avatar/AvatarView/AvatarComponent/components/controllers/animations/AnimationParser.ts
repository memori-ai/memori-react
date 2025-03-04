/**
 * AnimationCommand interface
 * Represents a parsed animation instruction that can be executed by the system
 */
export interface AnimationCommand {
    type: 'SINGLE' | 'SEQUENCE' | 'RANDOM';
    animations: string[];
    loopCount: number; // 0 for infinite
    fallbackToIdle: boolean;
  }
  
  /**
   * AnimationParser class
   * Handles parsing animation commands from strings
   */
  export class AnimationParser {
    // Regular expressions for parsing
    private static readonly SEQUENCE_REGEX = /->|→/; // Support both -> and → symbols
    private static readonly RANDOM_REGEX = /(\w+)\[(\d+),(\d+)\]/;
    private static readonly LOOP_REGEX = /\{(\d+)\}/; // Format: AIDA1{3} for 3 loops
    
    /**
     * Parse a command string into an AnimationCommand
     * @param command Command string (e.g., "AIDA1->AIDA2->AIDA3", "AIDA[1,6]", "AIDA1{3}")
     * @param options Default options for the command
     * @returns Parsed AnimationCommand
     */
    parse(
      command: string, 
      options: { 
        defaultLoopCount?: number, 
        fallbackToIdle?: boolean 
      } = {}
    ): AnimationCommand {
      const { defaultLoopCount = 1, fallbackToIdle = true } = options;
      
      // Handle empty or invalid commands
      if (!command || typeof command !== 'string') {
        return {
          type: 'SINGLE',
          animations: ['Idle1'], // Default to Idle1
          loopCount: 0, // Infinite
          fallbackToIdle: true
        };
      }
      
      // Extract loop count if specified
      let loopCount = defaultLoopCount;
      const loopMatch = command.match(AnimationParser.LOOP_REGEX);
      if (loopMatch) {
        loopCount = parseInt(loopMatch[1], 10);
        // Remove the loop part from the command
        command = command.replace(loopMatch[0], '');
      }
      
      // Check if it's a sequence
      if (AnimationParser.SEQUENCE_REGEX.test(command)) {
        return {
          type: 'SEQUENCE',
          animations: this.parseSequence(command),
          loopCount,
          fallbackToIdle
        };
      }
      
      // Check if it's a random selection
      if (AnimationParser.RANDOM_REGEX.test(command)) {
        return {
          type: 'RANDOM',
          animations: [this.parseRandom(command)],
          loopCount,
          fallbackToIdle
        };
      }
      
      // Otherwise, it's a single animation
      return {
        type: 'SINGLE',
        animations: [command.trim()],
        loopCount,
        fallbackToIdle
      };
    }
    
    /**
     * Parse a sequence like "AIDA1->AIDA2->AIDA3"
     * @param sequence Sequence string
     * @returns Array of animation names
     */
    parseSequence(sequence: string): string[] {
      // Split by -> or → and process each part
      const parts = sequence.split(AnimationParser.SEQUENCE_REGEX);
      
      return parts.map(part => {
        part = part.trim();
        
        // Handle random selection within sequence
        if (AnimationParser.RANDOM_REGEX.test(part)) {
          return this.parseRandom(part);
        }
        
        return part;
      });
    }
    
    /**
     * Parse a random selection like "AIDA[1,6]"
     * @param randomPattern Random pattern string
     * @returns Resolved animation name
     */
    parseRandom(randomPattern: string): string {
      const match = randomPattern.match(AnimationParser.RANDOM_REGEX);
      
      if (!match) {
        return randomPattern; // Not a random pattern, return as is
      }
      
      const [_, prefix, minStr, maxStr] = match;
      const min = parseInt(minStr, 10);
      const max = parseInt(maxStr, 10);
      
      // Generate random number between min and max (inclusive)
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      
      return `${prefix}${random}`;
    }
    
    /**
     * Validate if a sequence follows the correct format
     * @param sequence Sequence string
     * @returns Object with validation result and error message if invalid
     */
    validateSequence(sequence: string): { valid: boolean; error?: string } {
      // Check if sequence is not empty
      if (!sequence) {
        return { valid: false, error: 'Sequence cannot be empty' };
      }
      
      // Check if sequence has too many animations
      const parts = sequence.split(AnimationParser.SEQUENCE_REGEX);
      if (parts.length > 5) {
        return { 
          valid: false, 
          error: 'Sequence cannot contain more than 5 animations' 
        };
      }
      
      // Check if each part is valid
      for (const part of parts) {
        const trimmed = part.trim();
        
        // Check for empty parts
        if (!trimmed) {
          return { 
            valid: false, 
            error: 'Sequence contains empty animation name' 
          };
        }
        
        // Validate random pattern if present
        if (AnimationParser.RANDOM_REGEX.test(trimmed)) {
          const match = trimmed.match(AnimationParser.RANDOM_REGEX);
          if (match) {
            const min = parseInt(match[2], 10);
            const max = parseInt(match[3], 10);
            
            if (isNaN(min) || isNaN(max) || min > max || min < 1) {
              return { 
                valid: false, 
                error: `Invalid random range [${match[2]},${match[3]}] in ${trimmed}` 
              };
            }
          }
        }
      }
      
      return { valid: true };
    }
  }
  
  // Example usage:
  /*
  const parser = new AnimationParser();
  
  // Parse a sequence
  const sequenceCommand = parser.parse('AIDA1->AIDA2->AIDA3');
  console.log(sequenceCommand);
  // Output: { type: 'SEQUENCE', animations: ['AIDA1', 'AIDA2', 'AIDA3'], loopCount: 1, fallbackToIdle: true }
  
  // Parse a random selection
  const randomCommand = parser.parse('AIDA[1,6]');
  console.log(randomCommand);
  // Output: { type: 'RANDOM', animations: ['AIDA3'], loopCount: 1, fallbackToIdle: true } (random number between 1-6)
  
  // Parse with loop count
  const loopCommand = parser.parse('AIDA1{3}');
  console.log(loopCommand);
  // Output: { type: 'SINGLE', animations: ['AIDA1'], loopCount: 3, fallbackToIdle: true }
  
  // Parse complex command
  const complexCommand = parser.parse('Joy[1,3]->Surprise2->Anger[1,4]{2}');
  console.log(complexCommand);
  // Output: { type: 'SEQUENCE', animations: ['Joy2', 'Surprise2', 'Anger3'], loopCount: 2, fallbackToIdle: true }
  */