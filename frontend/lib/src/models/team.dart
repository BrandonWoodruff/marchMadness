class Team {
  final String name;
  final String seed;
  //final String Logo;
  final String region;

  Team({required this.name, required this.seed, required this.region});



    factory Team.fromJson(Map<String, dynamic> json) {
    // Implement the JSON parsing logic here
    return Team(
      name: json['name'],
      seed: json['seed'],
      region: json['region'],
      // Logo: json['Logo'],
      // Initialize fields from the JSON data
    );
  }

  
  
}
