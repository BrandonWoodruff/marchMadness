import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/matchup.dart';
import '../providers/selected_matchup_provider.dart';

class MatchPredictionPanel extends ConsumerWidget {
  const MatchPredictionPanel({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMatchup = ref.watch(selectedMatchupProvider);

    if (selectedMatchup == null) {
      return const Card(child: Padding(padding: EdgeInsets.all(16.0), child: Text('Select a matchup to see prediction')));
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Match Prediction', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            Text('${selectedMatchup.team1.name} vs. ${selectedMatchup.team2.name}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            // Placeholder for a circular chart or gauge
            Container(
              height: 100,
              width: 100,
              decoration: BoxDecoration(color: Colors.blueGrey[50], shape: BoxShape.circle),
              child: Center(child: Text('Chart')),
            ),
            const SizedBox(height: 16),
            Text('Preview: ${selectedMatchup.preview}'),
          ],
        ),
      ),
    );
  }
}
