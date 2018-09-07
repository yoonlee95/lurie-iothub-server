import json

import iothub_client
from iothub_client import IoTHubClient, IoTHubClientError, IoTHubTransportProvider, IoTHubClientResult
from iothub_client import IoTHubMessage, IoTHubMessageDispositionResult, IoTHubError, DeviceMethodReturnValue

class AZURE_IOTHUB(object):

    CONNECTION_STRING = "HostName=nicutest2.azure-devices.net;DeviceId=demo;SharedAccessKey=aWneFuC3sUFYO54NcpKqnnyBTtbYhpP63yPmzorZQgQ="
    PROTOCOL = IoTHubTransportProvider.MQTT
    MESSAGE_TIMEOUT = 10000

    def __init__(self):
        self.client = self.iothub_client_init()
        self.counter = 0
        self.internal_data = []

    def iothub_client_init(self):
        # Create an IoT Hub client
        client = IoTHubClient(self.CONNECTION_STRING, self.PROTOCOL)
        return client

    def event_callback(self, message, result, user_context):
        pass
    def send_telemetry(self, data):
        try:

            self.internal_data += data
            self.counter += 1

            if self.counter == 5:
                data_str = json.dumps(self.internal_data, separators=(',', ':'))
                message = IoTHubMessage(data_str)
                self.client.send_event_async(message, self.event_callback, None)

                self.counter = 0
                self.internal_data = []

        except IoTHubError as iothub_error:
            print ( "Unexpected error %s from IoTHub" % iothub_error )
            return

if __name__ == "__main__":
    import time

    cloud = AZURE_IOTHUB()
    cloud.send_telemetry("I Am HAPPY")
    time.sleep(2)