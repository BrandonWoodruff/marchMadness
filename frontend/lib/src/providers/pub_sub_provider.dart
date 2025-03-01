import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/tournament_model.dart';
import '../utils/pub_sub_client.dart'; // Exports Tournament, TournamentMatch, Team

final tournamentsStreamProvider = StreamProvider<List<Tournament>>((ref) {
  // Use localhost since we're on Apple/Xcode.
  final broker = 'localhost';
  
  // Instantiate PubSubClient with MQTT broker host, port, and a unique clientId.
  final pubSubClient = PubSubClient(
    broker,
    1883,
    'flutter_client_${DateTime.now().millisecondsSinceEpoch}',
  );
  
  // Register a dispose callback to clean up resources
  ref.onDispose(() {
    pubSubClient.disconnect();
  });
  
  // Subscribe to your topic, e.g., "get/East/2024/6"
  final stream = pubSubClient.subscribe("get/East/2024/6").map((message) {
    final jsonData = jsonDecode(message);
    print('Received JSON: $jsonData');
    // Assume the JSON represents a single tournament.
    return [Tournament.fromJson(jsonData)];
  });

  return stream;
});






// import 'dart:convert';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../models/tournament_model.dart'; // Ensure this file exports Tournament, etc.

// /// A fictional PubSubClient for demonstration purposes.
// /// Replace this with your actual pub/sub client.
// class PubSubClient {
//   // Example: Subscribe to a topic and get a stream of JSON messages.
//   Stream<String> subscribe(String topic) {
//     // TODO: Implement subscription logic to your pub/sub system.
//     // This is just a placeholder stream.
//     return Stream.periodic(
//       const Duration(seconds: 5),
//       (_) => '''
//       {
//         "matches": [
//           {
//             "id": "3",
//             "teamA": {"name": "Juventus", "seed": "1", "region": "Europe"},
//             "teamB": {"name": "Paris Saint-Germain", "seed": "2", "region": "Europe"},
//             "scoreTeamA": "0",
//             "scoreTeamB": "2"
//           }
//         ]
//       }
//       ''',
//     );
//   }
// }

// final tournamentsStreamProvider = StreamProvider<List<Tournament>>((ref) {
//   final pubSubClient = PubSubClient();
//   // Subscribe to your topic. For example: "get/East/2024/6"
//   final stream = pubSubClient.subscribe("get/East/2024/6").map((message) {
//     final jsonData = jsonDecode(message);
//     print(jsonData);
//     // Assume the JSON is an array of tournaments or a single tournament.
//     // Here, we wrap a single tournament in a list.
//     return [Tournament.fromJson(jsonData)];
//   });
//   return stream;
// });
