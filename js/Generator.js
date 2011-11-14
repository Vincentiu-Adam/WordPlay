// class that will handle automatic letter generation 

function Generator( distribution )
{
	this.distribution = distribution;
}

Generator.vowels = "aeiouy";
Generator.consonants = "tnshrdlm";
Generator.other  = "bcfgjkpqvwxz";

Generator.prototype.constructor = Generator;

Array.prototype.cumulateSum = function()
{
	for ( var i = 1, sum = 0; i < this.length; i++ )
		this[i] += this[i - 1];

}

Array.prototype.find = function( value ) 
{
	for ( var i = 0; i < this.length; i++ )
		if ( this[i] > value ) 
			return i;
	return i - 1;
}

Generator.prototype.generateVowel = function()
{
	// A = 8.17%, E = 12.7% I = 6.97% O = 7.51% U = 2.76% Y = 1.97%
	var distribution = [ 0.2, 0.3, 0.18, 0.16, 0.9, 0.7 ];
	distribution.cumulateSum();
	
	return Generator.vowels[ distribution.find( Math.random() ) ];
}

Generator.prototype.generateConsonant = function()
{
	// T = 9.06%, N = 6.75%, S = 6.33%, H = 6.09%, R = 5.99%, D = 4.25%, L = 4.03%, M = 2.41%;
	var distribution = [ 0.23, 0.16, 0.14, 0.13, 0.11, 0.09, 0.08, 0.06 ]
	distribution.cumulateSum();
	
	return Generator.consonants[ distribution.find( Math.random() ) ];
}

Generator.prototype.generateOther = function()
{
	// C = 2.78%, W = 2.36%, F = 2.23%, G = 2.02%, P = 1.93%, B = 1.49%, V = 0.98%, K = 0.77%, X = 0.15%, J = 0.15%, Q = 0.10%, Z = 0.07%
	var distribution = [ 0.12, 0.11, 0.10, 0.095, 0.09, 0.085, 0.08, 0.075, 0.075, 0.065, 0.055, 0.05]
	distribution.cumulateSum();
	
	return Generator.other[ distribution.find( Math.random() ) ];
}

Generator.prototype.generateCharacter = function() 
{
	var character;
	this.distribution.cumulateSum();
		switch ( this.distribution.find( Math.random() ) )
		{
			case 0  : character = this.generateVowel() ; break;
			case 1  : character = this.generateConsonant(); break;
			default : character = this.generateOther(); break;
		}
		
	return character;
}
Generator.prototype.generateLine = function( size )
{
	var result = new Array;
	for ( var i = 0; i < size; i++ )
		result.push( this.generateCharacter() );
	
	return result;
}

Generator.prototype.generate = function ( size )
{
	var result = [];
	
	for ( var i = 0; i < size; i++ )
		result.push( this.generateLine( size ) );
		
	return result;
}
