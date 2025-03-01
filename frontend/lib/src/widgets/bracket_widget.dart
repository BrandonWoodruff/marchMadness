import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/bracket_provider.dart';
import '../providers/selected_matchup_provider.dart';

class BracketWidget extends ConsumerWidget {
  const BracketWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final matchups = ref.watch(bracketProvider);

    return ListView.builder(
      itemCount: matchups.length,
      itemBuilder: (context, index) {
        final matchup = matchups[index];
        return GestureDetector(
          onTap: () {
            // Update the selected matchup
            ref.read(selectedMatchupProvider.notifier).state = matchup;
          },
          child: Card(
            margin: const EdgeInsets.all(8),
            child: ListTile(title: Text('${matchup.team1.name} vs. ${matchup.team2.name}'), subtitle: Text('Preview: ${matchup.preview}')),
          ),
        );
      },
    );
  }
}
