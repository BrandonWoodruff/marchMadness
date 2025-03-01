import 'dart:async';
import 'dart:convert';
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';

class PubSubClient {
  final MqttServerClient client;
 // 
  // Modified constructor to accept port as int
  PubSubClient(String broker, int port, String clientId)
      : client = MqttServerClient.withPort(broker, clientId, port);

  Future<void> connect() async {
    client.logging(on: false);
    client.keepAlivePeriod = 20;
    client.onDisconnected = _onDisconnected;
    client.onConnected = _onConnected;
    client.onSubscribed = _onSubscribed;

    final connMess = MqttConnectMessage()
        .withClientIdentifier(client.clientIdentifier)
        .startClean() // Ensures a clean session
        .withWillQos(MqttQos.atLeastOnce);
    client.connectionMessage = connMess;

    try {
      print('MQTT client connecting....');
      await client.connect();
    } catch (e) {
      print('MQTT client exception: $e');
      client.disconnect();
    }
  }

  static void _onConnected() {
    print('MQTT client connected');
  }

  static void _onDisconnected() {
    print('MQTT client disconnected');
  }

  static void _onSubscribed(String topic) {
    print('Subscribed to topic: $topic');
  }

  /// Subscribes to the given topic and returns a stream of JSON messages.
  Stream<String> subscribe(String topic) async* {
    await connect();
    client.subscribe(topic, MqttQos.atLeastOnce);

    final controller = StreamController<String>();

    client.updates!.listen((List<MqttReceivedMessage<MqttMessage>> c) {
      final recMess = c[0].payload as MqttPublishMessage;
      final payload = MqttPublishPayload.bytesToStringAsString(recMess.payload.message);
      controller.add(payload);
    });

    yield* controller.stream;
  }
}
