import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/matchup.dart';

final selectedMatchupProvider = StateProvider<Matchup?>((ref) => null);
