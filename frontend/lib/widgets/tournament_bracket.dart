


// This is a placeholder for the flutter tournament bracket that will be used if we need to display the bracket with the sections. 







// import 'package:flutter/material.dart';

// /// A widget that displays a tournament bracket in a March Madness style.
// ///
// /// This version adds optional region headers above each bracket column
// /// and uses a blue color scheme that fits the NCAA look.
// class TournamentBracket extends StatelessWidget {
//   /// Creates a [TournamentBracket] widget.
//   ///
//   /// The [list] parameter must not be null.
//   const TournamentBracket({
//     super.key,
//     this.itemsMarginVertical = 20.0,
//     this.cardHeight = 100.0,
//     this.cardWidth = 220.0,
//     this.card,
//     required this.list,
//     // Changed default color to blue for a March Madness vibe.
//     this.lineColor = Colors.blue,
//     this.lineBorderRadius = 10.0,
//     this.lineWidth = 60.0,
//     this.lineThickness = 5.0,
//     // Optional region labels (e.g., "East", "West", "Midwest", "South")
//     this.regionLabels,
//   }) : assert(
//          lineThickness <= cardHeight / 2,
//          "The line thickness must not exceed half the card height. Ensure that 'lineThickness' ($lineThickness) is <= 'cardHeight / 2' (${cardHeight / 2}).",
//        );

//   /// The vertical margin between items in the bracket.
//   final double itemsMarginVertical;

//   /// The height of each match card.
//   final double cardHeight;

//   /// The width of each match card.
//   final double cardWidth;

//   /// A custom widget builder for the match card.
//   final Widget Function(TournamentMatch match)? card;

//   /// The color of the lines connecting the matches.
//   final Color lineColor;

//   /// The border radius of the connector lines.
//   final double lineBorderRadius;

//   /// The width of the connector lines.
//   final double lineWidth;

//   /// The thickness of the connector lines.
//   final double lineThickness;

//   /// The list of tournament rounds.
//   final List<Tournament> list;

//   /// Optional region labels for each tournament round (e.g., "East", "West", etc.).
//   final List<String>? regionLabels;

//   @override
//   Widget build(BuildContext context) {
//     double separatorH = itemsMarginVertical;
//     // Increase overall height if region headers are provided.
//     final extraHeight = (regionLabels != null) ? 140.0 : 100.0;
//     return InteractiveViewer(
//       minScale: 0.1,
//       maxScale: 3.0,
//       boundaryMargin: const EdgeInsets.all(200.0),
//       constrained: false,
//       child: SizedBox(
//         height: ((list.first.matches.length * cardHeight) + ((list.first.matches.length - 1) * separatorH) + extraHeight),
//         child: ListView.separated(
//           scrollDirection: Axis.horizontal,
//           physics: const NeverScrollableScrollPhysics(),
//           shrinkWrap: true,
//           itemCount: list.length,
//           itemBuilder: (_, index) {
//             final Tournament item = list[index];
//             separatorH = calculateSeparatorHeight(groupsSize: index, itemsMarginVertical: itemsMarginVertical, cardHeight: cardHeight);
//             return Column(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 // Display region label if provided.
//                 if (regionLabels != null && regionLabels!.length > index)
//                   Padding(
//                     padding: const EdgeInsets.only(bottom: 8.0),
//                     child: Text(
//                       regionLabels![index],
//                       style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue),
//                     ),
//                   ),
//                 _MatchesList(
//                   cardWidth: cardWidth,
//                   cardHeight: cardHeight,
//                   card: card,
//                   matchCount: item.matches.length,
//                   separatorHeight: separatorH,
//                   matches: item.matches,
//                 ),
//               ],
//             );
//           },
//           separatorBuilder: (_, index) {
//             final Tournament item = list[index];
//             return Column(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 Flexible(
//                   child: SizedBox(
//                     width: lineWidth,
//                     child: ListView.separated(
//                       itemCount: item.matches.length ~/ 2,
//                       physics: const NeverScrollableScrollPhysics(),
//                       shrinkWrap: true,
//                       itemBuilder: (_, index) {
//                         return Row(
//                           crossAxisAlignment: CrossAxisAlignment.center,
//                           children: [
//                             Expanded(
//                               child: Container(
//                                 height: (separatorH + cardHeight),
//                                 decoration: BoxDecoration(
//                                   borderRadius: BorderRadius.horizontal(right: Radius.circular(lineBorderRadius)),
//                                   border: Border(
//                                     top: BorderSide(color: lineColor, width: lineThickness, strokeAlign: BorderSide.strokeAlignCenter),
//                                     right: BorderSide(color: lineColor, width: lineThickness, strokeAlign: BorderSide.strokeAlignCenter),
//                                     bottom: BorderSide(color: lineColor, width: lineThickness, strokeAlign: BorderSide.strokeAlignCenter),
//                                   ),
//                                 ),
//                               ),
//                             ),
//                             Expanded(child: Divider(thickness: lineThickness, height: lineThickness, color: lineColor)),
//                           ],
//                         );
//                       },
//                       separatorBuilder: (_, index) {
//                         return SizedBox(height: (cardHeight + separatorH));
//                       },
//                     ),
//                   ),
//                 ),
//               ],
//             );
//           },
//         ),
//       ),
//     );
//   }
// }

// /// A widget that displays a vertical list of match cards.
// class _MatchesList extends StatelessWidget {
//   /// Creates a [_MatchesList] widget.
//   const _MatchesList({
//     required this.matchCount,
//     required this.separatorHeight,
//     this.cardHeight = 100.0,
//     this.cardWidth = 220.0,
//     this.card,
//     required this.matches,
//   });

//   /// The number of matches to be displayed.
//   final int matchCount;

//   /// The height of the separator between match cards.
//   final double separatorHeight;

//   /// The height of each match card.
//   final double? cardHeight;

//   /// The width of each match card.
//   final double? cardWidth;

//   /// A custom widget for the match card.
//   final Widget Function(TournamentMatch match)? card;

//   final List<TournamentMatch> matches;

//   @override
//   Widget build(BuildContext context) {
//     return SizedBox(
//       width: cardWidth ?? 220.0,
//       child: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: [
//           Flexible(
//             child: ListView.separated(
//               itemCount: matches.length,
//               physics: const NeverScrollableScrollPhysics(),
//               shrinkWrap: true,
//               itemBuilder: (_, index) {
//                 final TournamentMatch item = matches[index];
//                 return SizedBox(height: cardHeight ?? 100.0, child: card != null ? card!(item) : BracketMatchCard(item: item));
//               },
//               separatorBuilder: (_, int index) {
//                 return Container(height: separatorHeight);
//               },
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
