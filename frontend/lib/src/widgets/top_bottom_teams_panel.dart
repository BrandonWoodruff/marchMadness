import 'package:flutter/material.dart';

class TopBottomTeamsPanel extends StatelessWidget {
  final List<String> topTeams;
  final List<String> bottomTeams;

  const TopBottomTeamsPanel({Key? key, required this.topTeams, required this.bottomTeams}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Top 5 Teams', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            ...topTeams.map((team) => Text(team)).toList(),
            const Divider(height: 20),
            Text('Bottom 5 Teams', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            ...bottomTeams.map((team) => Text(team)).toList(),
          ],
        ),
      ),
    );
  }
}
