from django.db import models

class Account(models.Model):
    name = models.CharField(max_length=50, unique=True)
    initial_balance = models.DecimalField(max_digits=9, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=3)
    overpayments = models.BooleanField(default=True)
    minimum_payment = models.DecimalField(max_digits=9, decimal_places=2)

    def __unicode__(self):
        return self.name

class Transaction(models.Model):
    account = models.ForeignKey(Account)
    date = models.DateField()
    amount = models.DecimalField(max_digits=9, decimal_places=2)

    def __unicode__(self):
        d = self.date
        return '%d/%d/%d - %s' % (self.d.month, self.d.day, self.d.year, self.account.name)
