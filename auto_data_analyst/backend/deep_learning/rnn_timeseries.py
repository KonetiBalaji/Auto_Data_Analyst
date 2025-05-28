import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

class LSTMTimeSeries(nn.Module):
    """A simple LSTM for time series forecasting."""
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, output_size=1):
        super(LSTMTimeSeries, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out

def train_lstm(model, dataloader, criterion, optimizer, device):
    """Train the LSTM model."""
    model.train()
    for sequences, targets in dataloader:
        sequences, targets = sequences.to(device), targets.to(device)
        optimizer.zero_grad()
        outputs = model(sequences)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
    return model

def predict_lstm(model, sequences, device):
    """Predict future values for a batch of sequences."""
    model.eval()
    with torch.no_grad():
        sequences = sequences.to(device)
        outputs = model(sequences)
    return outputs.cpu().numpy() 